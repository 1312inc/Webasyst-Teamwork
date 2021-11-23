<?php

class tasksBackendFixActions extends waViewActions
{
    protected function preExecute()
    {
        if (!wa()->getUser()->isAdmin()) {
            throw new tasksAccessException('Must be admin');
        }
    }

    public function projectNumberAction()
    {
        $projectModel = new tasksProjectModel();
        foreach ($projectModel->getAll() as $project) {
            $projectModel->recountTasksNumber($project['id']);
        }

        $this->redirect(wa()->getAppUrl());
    }
}
