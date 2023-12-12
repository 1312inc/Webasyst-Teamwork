<?php

class tasksAutocompleteMethod extends tasksApiAbstractMethod
{
    public function run(): tasksApiResponseInterface
    {
        $limit = waRequest::get('limit', 10, 'int');
        $limit = max(1, min($limit, 50));
        $term = waRequest::get('term', '', 'string');
        $context_task_id = waRequest::get('task_id', null, 'int');

        return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, [
            'data' => (new tasksApiAutocompleteHandler([
                'absolute_urls' => true,
                'context_task_id' => ifempty($context_task_id, null),
            ]))->handle($term, $limit),
        ]);
    }
}
