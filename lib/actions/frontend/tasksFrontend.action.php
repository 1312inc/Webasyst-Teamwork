<?php

class tasksFrontendAction extends waViewAction
{
    public function execute()
    {
        wa()->getResponse()->setStatus(404);
        $this->setTemplate(wa()->getAppPath('templates/frontend/public_task_error.html'));
    }
}
