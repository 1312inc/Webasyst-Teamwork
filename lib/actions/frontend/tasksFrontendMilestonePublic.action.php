<?php

class tasksFrontendMilestonePublicAction extends waViewAction
{
    public function execute()
    {
        $public_hash = waRequest::param('public_hash', '', waRequest::TYPE_STRING_TRIM);
        if (!$public_hash) {
            $this->notFound();
        }

        $repository = tsks()->getEntityRepository(tasksMilestone::class);

        /** @var tasksMilestone $milestone */
        $milestone = $repository->findByFields('public_hash', $public_hash);
        if (!$milestone) {
            $this->notFound();
        }

        $collection = new tasksCollection(sprintf('%s/%s', tasksCollection::HASH_SCOPE, $milestone->getId()), ['check_rights' => false]);
        $tasks = $collection->getTasks(tasksCollection::FIELDS_TO_GET);

        foreach ($tasks as &$_task) {
            $_task = new tasksTask($_task['id']);
        }
        unset($_task);

        $this->setTemplate(wa()->getAppPath('templates/frontend/public_milestone.html'));
        $this->view->assign([
            'milestone' => $milestone,
            'tasks' => $tasks
        ]);
    }

    private function notFound()
    {
        wa()->getResponse()->setStatus(404);
        $this->setTemplate(wa()->getAppPath('templates/frontend/public_task_error.html'));

        exit();
    }
}
