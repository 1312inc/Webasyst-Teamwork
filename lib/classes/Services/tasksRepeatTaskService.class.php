<?php
/** Called from cron CLI and onCount to handle creation of task duplicates for repeating tasks. */
class tasksRepeatTaskService
{
    protected $app_settings_model = null;

    /** Safe to run as often as needed (e.g. from onCount) and will skip heavy duty if called too early. */
    public function worker()
    {
        if ($this->shouldSkip()) {
            return;
        }
        
        try {
            $this->duplicateAllRepeatingTasks();
            $this->markSuccessfullRun();
        } catch (Throwable $e) { 
            // failed to duplicate: do not try again
            waLog::log([
                'Error during task duplicate',
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

    protected function duplicateAllRepeatingTasks()
    {
        $task_model = new tasksTaskModel();
        $repeat_model = new tasksTaskRepeatModel();

        foreach ($repeat_model->getTasksReadyToRepeat() as $r) {
            try {
                // Duplicate task
                $original = new tasksTask($r['task_id']);
                $duplicate = $original->duplicate();

                // Update duplicate
                $task_model->updateById($duplicate->id, [
                    'status_id' => 0, // new
                    'due_date' => $r['mode'] == 'on_due' ? date('Y-m-d', time() + 3600*24) : null,
                    'repeat_task_id' => ifempty($duplicate, 'repeat_task_id', $original->id),
                    'repeat_occurrence' => 1 + ifempty($duplicate, 'repeat_occurrence', 0),
                ]);

                // Disable repeat of original task and set up repeat of the duplicate
                $repeat_model->deleteById($r['task_id']);
                $repeat_date_base = $r['mode'] == 'on_due' ? $r['repeat_date'] : null;
                unset($r['task_id'], $r['repeat_date']);
                $repeat_model->saveRepeat($duplicate->id, $r, $repeat_date_base);

                // Add log item to original task
                tasksHelper::addLog($original, [
                    'action' => '',
                    'text' => sprintf_wp('Repeating task created: %s', '#'.$duplicate['project_id'].'.'.$duplicate['number']),
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
}
