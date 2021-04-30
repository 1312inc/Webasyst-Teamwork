<?php

require_once(dirname(__FILE__) . '/../../tasksTestCase.php');
require_once(dirname(__FILE__) . '/mock/tasksMockNotificationsSender.php');

class tasksNotificationsSenderCreateAndDoneTest extends tasksTestCase
{
    protected $task;
    protected $log_item;

    public function setUp()
    {
        parent::setUp();
        $this->task = $this->create();
        $this->log_item = $this->done($this->task);
    }

    protected function create()
    {
        $author_contact = $this->createContact();
        $assign_contact = $this->createContact();
        $task = $this->createTask(array(
            'create_contact_id' => $author_contact->getId(),
            'assigned_contact_id' => $assign_contact->getId()
        ));

        $log_model = new tasksTaskLogModel();

        // Add to task log
        $log_model->add(array(
            'project_id' => $task['project_id'],
            'task_id' => $task['id'],
            'action' => 'create',
            'create_datetime' => date('Y-m-d H:i:s'),
            'before_status_id' => null,
            'after_status_id' => $task['status_id'],
            'assigned_contact_id' => ifempty($task['assigned_contact_id']),
        ));

        return $task;
    }

    protected function done($task)
    {
        $data = array(
            'status_id' => 1,
            'text' => uniqid('UnitTestComment', true) . '. Task is Done',
            $data['assigned_contact_id'] = $task['create_contact_id']
        );
        return tasksHelper::addLog($this->task, $data, false);
    }

    public function testPreventDoubleSending()
    {
        $send_map = array(
            'comment' => array(1,2,3,7),
            'done' => array(1,4,5),
            'assign' => array(1,2,3,6)
        );

        $sender = $this->getMockBuilder('tasksMockNotificationsSender')
                ->setMethods(array('prepareSendMap'))
                ->setConstructorArgs(array(
                    $this->task,
                    null,
                    array(
                        'check_rights' => false
                    )
                ))->getMock();
        /*
        $sender = $this->getMock(
            'tasksMockNotificationsSender',
            array('prepareSendMap'),
            array(
                    $this->task,
                    null,
                    array(
                        'check_rights' => false
                    )
                )
            );*/
        $sender->expects($this->any())
                ->method('prepareSendMap')
                ->will($this->returnValue($send_map));

        $sender->send();

        $expect = array(
            array(1, 'done'),
            array(4, 'done'),
            array(5, 'done'),
            array(2, 'assign'),
            array(3, 'assign'),
            array(6, 'assign'),
            array(7, 'comment')
        );

        $this->assertEquals($expect, $sender->sent_map);
    }
}
