<?php
require_once(realpath(dirname(__FILE__).'/../../../../').'/init.php');
require_once(dirname(__FILE__).'/../../../../lib/classes/test.AuthUser.class.php');

class tasksTaskGetCreateContactTest extends PHPUnit_Framework_TestCase
{
    protected $tables = array('tasks_task', 'tasks_task_log', 'wa_contact');
    public function setUp()
    {
        wa('tasks');
        waTestEnvironment::getInstance()->setUpEmptyTemporaryTables($this->tables);
    }

    public function testGetCreateContact_issetCreateContact_returnValidContact()
    {
        $contact = $this->createContact(array('name'=> 'Test1'));
        $this->createTaskWithTaskId($contact->getId());
        $task = new tasksTask(1);
        $create_contact = $task->create_contact;
        $this->assertEquals('Test1',$create_contact->getName());
    }

    public function testGetCreateContact_deleteCreateContact_returnDeleteContact()
    {
        $this->createTaskWithTaskId();
        $task = new tasksTask(2);
        $create_contact = $task->create_contact;
        $this->assertEquals('0',$create_contact->getId());
        $this->assertEquals('0',strpos($create_contact->getName(), 'Delete'));
    }

    protected function createTaskWithTaskId($contact_id = null)
    {
        $task_model = new tasksTaskModel();

        $tasks = array(
            array(
                'id'                  => '1',
                'name'                => 'Test task',
                'text'                => 'Test task text',
                'create_contact_id'   =>  $contact_id,
                'create_datetime'     => '2018-05-18 11:22:01',
                'update_datetime'     => '2018-05-18 11:22:01',
                'assigned_contact_id' => '1',
                'project_id'          => '1',
                'number'              => '1',
                'status_id'           => '0',
                'parent_id'           => null,
                'priority'            => '0',
                'assign_log_id'       => null,
                'contact_id'          => null,
                'hidden_timestamp'    => '0',
                'milestone_id'        => '1',
            ),
            array(
                'id'                  => '2',
                'name'                => 'Test task',
                'text'                => 'Test task text',
                'create_contact_id'   => '100500',
                'create_datetime'     => '2018-05-18 11:22:01',
                'update_datetime'     => '2018-05-18 11:22:01',
                'assigned_contact_id' => '1',
                'project_id'          => '1',
                'number'              => '2',
                'status_id'           => '0',
                'parent_id'           => null,
                'priority'            => '0',
                'assign_log_id'       => null,
                'contact_id'          => null,
                'hidden_timestamp'    => '0',
                'milestone_id'        => '1',
            )
        );
        $task_model->multipleInsert($tasks);
    }

    protected function createContact($data = array())
    {
        $contact = new waContact();
        if (empty($contact['name'])) {
            $contact['name'] = __CLASS__ . 'Contact' . rand();
        }
        $contact->save($data);
        if (isset($data['photo_path'])) {
            $contact->setPhoto($data['photo_path']);
        }

        return $contact;
    }

    public function tearDown()
    {
        waTestEnvironment::getInstance()->deleteTemporaryTables($this->tables);
    }
}