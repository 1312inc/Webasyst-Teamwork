<?php

class tasksTasksAiController extends waJsonController
{
    public function execute()
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
}
