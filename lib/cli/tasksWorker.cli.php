<?php
class tasksWorkerCli extends waCliController
{
    public function execute()
    {
        (new tasksRepeatTaskService())->worker();
    }
}
