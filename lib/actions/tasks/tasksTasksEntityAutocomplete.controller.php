<?php
/**
 * When user enters # in task editor, there's a search with dropdown.
 * It contains entities from different applications: tags from Tasks, deals from CRM, etc.
 * This controller implements the list inside the dropdown.
 * UI 2.0 only.
 */
class tasksTasksEntityAutocompleteController extends waJsonController
{
    const DEFAULT_LIMIT = 20;

    public function execute()
    {
        $limit = waRequest::request('limit', self::DEFAULT_LIMIT, 'int');
        $limit = min($limit, 50);
        $term = waRequest::request('term', '', 'string');
        $this->response = (new tasksApiAutocompleteHandler())->handle('#'.$term, $limit);
    }
}
