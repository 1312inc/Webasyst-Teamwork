<?php
/** Called from cron CLI and onCount to handle creation of task duplicates for repeating tasks. */
class tasksRepeatTaskService
{
    protected $app_settings_model = null;
    protected $repeat_model = null;

    /** Safe to run as often as needed (e.g. from onCount) and will skip heavy duty if called too early. */
    public function worker()
    {
        if ($this->shouldSkip()) {
            return;
        }
        
        try {
            $this->duplicateRepeatingTasks($this->getRepeatModel()->getTasksReadyToRepeat());
            $this->markSuccessfullRun();
        } catch (Throwable $e) { 
            waLog::log([
                'Error during task duplicate',
                $e->getMessage(),
                $e instanceof waException ? $e->getFullTraceAsString() : $e->getTraceAsString(),
            ], 'tasks/duplicate.log');
        }
    }

    public function duplicateOneRepeatingTask(int $task_id)
    {
        try {
            $row = $this->getRepeatModel()->getById($task_id);
            if (!empty($row['repeat_date']) && strtotime($row['repeat_date']) <= time()) {
                $this->duplicateRepeatingTasks([$row['task_id'] => $row]);
            }
        } catch (Throwable $e) { 
            waLog::log([
                'Error during single task duplicate',
                $e->getMessage(),
                $e instanceof waException ? $e->getFullTraceAsString() : $e->getTraceAsString(),
            ], 'tasks/duplicate.log');
        }
    }

    protected function shouldSkip(): bool
    {
        try {
            if (!waLicensing::check('tasks')->hasPremiumLicense(true)) {
                return true;
            }
        } catch (waException $e) {
            return true; // unable to check license: skip the run (not essencial)
        }
        $run_period = (int) tsks()->getOption('repeating_run_period');
        $last_run = (int) $this->getAppSettingsModel()->get('tasks', 'repeating_done', 0);
        return $last_run + $run_period > time();
    }

    protected function markSuccessfullRun()
    {
        $this->getAppSettingsModel()->set('tasks', 'repeating_done', time());
    }

    protected function duplicateRepeatingTasks(array $rows)
    {
        $task_model = new tasksTaskModel();
        $repeat_model = $this->getRepeatModel();

        foreach ($rows as $r) {
            try {
                // Duplicate task
                $original = new tasksTask($r['task_id']);
                $duplicate = $original->duplicate();

                $due_date = null;
                if ($r['mode'] == 'on_due') {
                    $due_date = new DateTime($r['repeat_date']);
                } else if ($r['mode'] == 'on_complete') {
                    $due_date = new DateTime(ifempty($original, 'due_date', null));
                }
                if ($due_date) {
                    $due_date->add(new DateInterval('P'.$r['frequency'].strtoupper($r['measure'][0])));
                    $due_date = $due_date->format('Y-m-d');
                }

                // Update duplicate
                $task_model->updateById($duplicate->id, [
                    'status_id' => 0, // new
                    'due_date' => $due_date,
                    'repeat_task_id' => ifempty($duplicate, 'repeat_task_id', $original->id),
                    'repeat_occurrence' => 1 + ifempty($duplicate, 'repeat_occurrence', 0),
                ]);

                // Disable repeat of original task and set up repeat of the duplicate
                $repeat_model->deleteById($r['task_id']);
                $repeat_date_base = $r['mode'] == 'on_due' ? $due_date : null;
                unset($r['task_id'], $r['repeat_date']);
                $repeat_model->saveRepeat($duplicate->id, $r, $repeat_date_base);

                // Add log item to original task
                tasksHelper::addLog($original, [
                    'action' => '',
                    'text' => sprintf_wp('Repeating task created: %s', '#'.$duplicate['project_id'].'.'.$duplicate['number']),
                    'do_not_update_datetime' => true,
                ]);

                // Add log item to duplicate
                tasksHelper::addLog($duplicate, [
                    'action' => '',
                    'text' => sprintf_wp('Auto-created based on the original repeating task: %s', '#'.$original['project_id'].'.'.$original['number']),
                    'do_not_update_datetime' => true,
                ]);
            } catch (waException $e) {
                // failed to duplicate: do not try again
                waLog::log([
                    'Unable to duplicate task',
                    $e->getMessage(),
                    $e instanceof waException ? $e->getFullTraceAsString() : $e->getTraceAsString(),
                    $r,
                ], 'tasks/duplicate.log');
                $repeat_model->deleteById(ifset($r, 'task_id', $original->id));
            }
        }
    }

    protected function getAppSettingsModel(): waAppSettingsModel
    {
        if (!$this->app_settings_model) {
            $this->app_settings_model = new waAppSettingsModel();
        }
        return $this->app_settings_model;
    }

    protected function getRepeatModel(): tasksTaskRepeatModel
    {
        if (!$this->repeat_model) {
            $this->repeat_model = new tasksTaskRepeatModel();
        }
        return $this->repeat_model;
    }
}
