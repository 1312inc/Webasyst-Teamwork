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

    /**
     * available model
     * https://yandex.cloud/ru/docs/ai-studio/pricing
     * https://yandex.cloud/ru/docs/ai-studio/concepts/generation/models
     *
     * @return void
     */
    private function setModel()
    {
        $this->response['fields'][] = [
            'id' => 'model',
            'type' => 'radio',
            'title' => 'Модель',
            'items' => [
                'yandexgpt-lite'      => '(0,20 ₽) yandexgpt-lite',
                'yandexgpt'           => '(1,20 ₽) yandexgpt',
                'yandexgpt/RC'        => '(0,40 ₽) yandexgpt/RC',
                'qwen3-235b-a22b-fp8' => '(0,50 ₽) qwen3-235b-a22b-fp8',
                'gpt-oss-120b'        => '(0,30 ₽) gpt-oss-120b',
                'gpt-oss-20b'         => '(0,10 ₽) gpt-oss-20b',
                'gemma-3-27b-it'      => '(0,40 ₽) gemma-3-27b-it',
            ]
        ];
        $this->response['sections'][1]['fields'][] = 'model';
    }

    private function taskfields()
    {
        try {
            $cache_fields = new waVarExportCache('tasks_fields_ai', 3600, 'tasks');
            $task_fields = $cache_fields->get();

            if ($task_fields === null) {
                $content = (new waServicesApi())->serviceCall('AI_OVERVIEW', ['facility' => 'task'], 'POST');
                $this->response = $content['response'];
                $this->setModel();
                if (ifset($this->response, 'error', null)) {
                    $this->errors = $this->response;
                    $this->response = null;
                } else {
                    $cache_fields->set($this->response);
                }
            } else {
                $this->response = $task_fields;

                if (waRequest::get('html')) {
                    $view = wa()->getView();
                    $view->assign('params', $task_fields);
                    $view->assign('is_premium', waLicensing::check('tasks')->isPremium());
                    $view->assign('tasks_try_free_count', (new waAppSettingsModel())->get('tasks', 'tasks_try_free_count', 0));

                    $this->response['html'] = $view->fetch(wa()->getAppPath() . '/templates/actions/tasks/TaskAiDialog.html');
                }
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
