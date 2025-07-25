<?php

class tasksMilestonesMilestoneInfoController extends waJsonController
{
    public function execute()
    {
        if (!$this->getUser()->isAdmin('tasks')) {
            $this->setError(_w('Access denied'));
            return;
        }

        $milestone_id = waRequest::get('milestone_id', null, waRequest::TYPE_INT);
        $collection = new tasksCollection(tasksCollection::HASH_SCOPE.'/'.$milestone_id);
        $collection->orderBy('create_datetime');

        $this->response = array_map(function ($t) {
            $t['log'] = array_values($t['log']);
            return $t;
        }, array_values($collection->getTasks('*, log', 0, 500)));
    }
}
