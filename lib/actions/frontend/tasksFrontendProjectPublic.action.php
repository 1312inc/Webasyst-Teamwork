<?php

class tasksFrontendProjectPublicAction extends waViewAction
{
    public function execute()
    {
        $public_hash = waRequest::param('public_hash', '', waRequest::TYPE_STRING_TRIM);
        if (!$public_hash) {
            $this->notFound();
        }

        $repository = tsks()->getEntityRepository(tasksProject::class);

        /** @var tasksProject $project */
        $project = $repository->findByFields('public_hash', $public_hash);
        if (!$project) {
            $this->notFound();
        }

        $collection = new tasksCollection(sprintf('%s/%s', tasksCollection::HASH_PROJECT, $project->getId()), ['check_rights' => false]);
        $tasks = $collection->getTasks(tasksCollection::FIELDS_TO_GET);

        foreach ($tasks as &$_task) {
            $_task = new tasksTask($_task['id']);
        }
        unset($_task);

        tasksHelper::workupTasksForView($tasks);

        $this->setTemplate(wa()->getAppPath('templates/frontend/public_project.html'));
        $this->view->assign([
            'project' => $project,
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
