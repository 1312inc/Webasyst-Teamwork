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
                'content'  => $text
            ], 'POST');
            $this->response = $content;
        } catch (Exception $exception) {
            $this->errors = [
                'error' => $exception->getCode(),
                'error_description' => $exception->getMessage()
            ];
        }
    }
}
