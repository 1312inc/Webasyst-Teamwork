<?php
/**
 * Autocomplete when user enters @ in task editor.
 */
class tasksTasksMentionAutocompleteController extends waJsonController
{
    const DEFAULT_LIMIT = 20;

    public function execute()
    {
        $limit = waRequest::request('limit', self::DEFAULT_LIMIT, 'int');
        $limit = min($limit, 50);
        $term = waRequest::request('term', '', 'string');
        $this->response = (new tasksApiAutocompleteHandler())->handle('@'.$term, $limit);
    }
}
