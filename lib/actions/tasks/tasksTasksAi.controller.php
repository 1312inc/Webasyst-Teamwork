<?php

class tasksTasksAiController extends waJsonController
{
    public function execute()
    {
        $type = waRequest::get('type', 'spellcheck', waRequest::TYPE_STRING_TRIM);

        $method = strtolower($type);
        switch ($method) {
            case 'spellcheck':
                $this->spellcheck();
                break;
            case 'taskfields':
                $this->taskfields();
                break;
            case 'writetask':
                $this->writetask();
                break;
            case 'tryfree':
                $this->tryFree();
                break;
            default:
                $this->errors = [
                    'error' => 'error_type',
                    'error_description' => 'Unknown parameter type'
                ];
        }
    }

    private function spellcheck()
    {
        $text = waRequest::post('text');
        if (!$text || !is_string($text)) {
            $this->errors = [
                'error' => 'incorrect_text',
                'error_description' => 'Incorrect text to process'
            ];
            return;
        }

        try {
            $content = (new waServicesApi())->serviceCall('AI', [
                'facility' => 'spellcheck',
                'content'  => $text,
                'locale'   => wa()->getLocale()
            ], 'POST');
            $this->response = $content['response'];
            if ($err = ifset($this->response, 'error', null)) {
                if ($err === 'payment_required') {
                    $result = (new waServicesApi)->getBalanceCreditUrl('AI');
                    if (ifset($result, 'response', 'url', false)) {
                        $this->response['error_description'] = str_replace('%s', 'href="'.$result['response']['url'].'"', $this->response['error_description']);
                    }
                }
                $this->errors = $this->response;
                $this->response = null;
            } elseif (isset($this->response['content']) && is_string($this->response['content'])) {
                $this->response['format_content'] = tasksTask::formatText($this->response['content']);
            }
        } catch (Exception $exception) {
            $this->errors = [
                'error' => 'exception_'.$exception->getCode(),
                'error_description' => $exception->getMessage()
            ];
        }
    }

    private function taskfields()
    {
        try {
            $cache_fields = new waVarExportCache('tasks_fields_ai', 3600, 'tasks');
            $task_fields = $cache_fields->get();
            $send_html = false;

            if ($task_fields === null) {
                $content = (new waServicesApi())->serviceCall('AI_OVERVIEW', ['facility' => 'task'], 'POST');
                $this->response = $content['response'];
                if (ifset($this->response, 'error', null)) {
                    $this->errors = $this->response;
                    $this->response = null;
                } else {
                    $task_fields = $this->response;
                    $cache_fields->set($task_fields);
                    $send_html = true;
                }
            } else {
                $this->response = $task_fields;
                $send_html = true;
            }

            if (waRequest::get('html') && $send_html) {
                $tasks_try_free_count = (new waAppSettingsModel())->get('tasks', 'tasks_try_free_count', 0);
                $tasks_free_try_count_max = 10;
                $view = wa()->getView();
                $view->assign('params', $task_fields);
                $view->assign('is_premium', waLicensing::check('tasks')->hasPremiumLicense());
                $view->assign('tasks_try_free_count', $tasks_try_free_count);
                $view->assign('tasks_try_free_left', $tasks_free_try_count_max - (int)$tasks_try_free_count);

                $this->response['html'] = $view->fetch(wa()->getAppPath() . '/templates/actions/tasks/TaskAiDialog.html');
            }
        } catch (Exception $exception) {
            $this->errors = [
                'error' => 'exception_'.$exception->getCode(),
                'error_description' => $exception->getMessage()
            ];
        }
    }

    private function writetask()
    {
        $objective = waRequest::post('objective', null, waRequest::TYPE_STRING_TRIM);
        $context = waRequest::post('context', null, waRequest::TYPE_STRING_TRIM);
        $deadline = waRequest::post('deadline', null, waRequest::TYPE_STRING_TRIM);
        $priority = waRequest::post('priority', null, waRequest::TYPE_STRING_TRIM);
        $text_length = waRequest::post('text_length', null, waRequest::TYPE_STRING_TRIM);
        $locale = waRequest::post('locale', null, waRequest::TYPE_STRING_TRIM);
        $style = waRequest::post('style', null, waRequest::TYPE_STRING_TRIM);
        $model = waRequest::post('model', null, waRequest::TYPE_STRING_TRIM);

        try {
            $content = (new waServicesApi())->serviceCall('AI', [
                'facility' => 'task',
                'objective' => $objective,
                'context' => $context,
                'deadline' => $deadline,
                'priority' => $priority,
                'text_length' => $text_length,
                'style' => $style,
                'model' => $model,
                'locale' => $locale
            ], 'POST');

            $this->response = $content['response'];
            if ($err = ifset($this->response, 'error', null)) {
                if ($err === 'payment_required') {
                    $result = (new waServicesApi)->getBalanceCreditUrl('AI');
                    if (ifset($result, 'response', 'url', false)) {
                        $this->response['error_description'] = str_replace('%s', 'href="'.$result['response']['url'].'"', $this->response['error_description']);
                    }
                }
                $this->errors = $this->response;
                $this->response = null;
            } elseif (isset($this->response['content']) && is_string($this->response['content'])) {
                $this->response['format_content'] = tasksTask::formatText($this->response['content']);
            }
        } catch (Exception $exception) {
            $this->errors = [
                'error' => 'exception_'.$exception->getCode(),
                'error_description' => $exception->getMessage()
            ];
        }
    }

    private function tryFree() {
        $app_settings_model = new waAppSettingsModel();
        $prev_count = $app_settings_model->get('tasks', 'tasks_try_free_count', 0) + 1;
        $app_settings_model->set('tasks', 'tasks_try_free_count', $prev_count);
        $this->response['is_max_count'] = $prev_count >= 10;
    }
}
