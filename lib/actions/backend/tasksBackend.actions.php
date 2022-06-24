<?php

class tasksBackendActions extends waJsonActions
{
    public function hideTinyAdAction()
    {
        (new tasksTinyAddService())->setHideFlagForUser($this->getUser());
    }
}
