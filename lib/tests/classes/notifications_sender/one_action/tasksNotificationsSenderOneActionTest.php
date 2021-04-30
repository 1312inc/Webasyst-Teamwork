<?php

require_once(dirname(__FILE__) . '/../../../tasksTestCase.php');
require_once(dirname(__FILE__) . '/../mock/tasksMockNotificationsSender.php');

abstract class tasksNotificationsSenderOneActionTest extends tasksTestCase
{
    protected $task;
    protected $log_item;

    /**
     * @var tasksMockNotificationsSender
     */
    protected $sender;

    public function setUp()
    {
        parent::setUp();
        $task = $this->create();
        $this->task = $task;

        $this->sender = new tasksMockNotificationsSender($this->task, 'comment', array(
            'check_rights' => false
        ));
    }

    protected function create()
    {
        $author_contact = $this->createContact();
        $assign_contact = $this->createContact();
        $task = $this->createTask(array(
            'create_contact_id' => $author_contact->getId(),
            'assigned_contact_id' => $assign_contact->getId()
        ));
        return $task;
    }

    /*
    protected function comment($task)
    {
        $log = tasksHelper::addLog($task, array(
            'action' => 'comment',
            'text' => uniqid('UnitTestComment', true)
        ), false);
        return $log;
    }*/

    abstract public function testMethodCheckNeedSendByAction();

    abstract public function testMethodCheckNeedSentByTask();

    abstract public function testMethodPrepareSendMap();
}
