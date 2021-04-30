<?php
require_once(realpath(dirname(__FILE__).'/../../../../').'/init.php');

class tasksTaskModelGetCountTasksTest extends PHPUnit_Framework_TestCase
{
    public function setUp()
    {
        wa('tasks');
        waTestEnvironment::getInstance()->setUpEmptyTemporaryTables(array('tasks_task'));
    }

    public function testGetCountTaskInScope_taskEmpty_returnNull()
    {
        $m = new tasksTaskModel();
        $result = $m->getCountTasksInScope();
        $this->assertEmpty($result);
    }

    public function testGetCountTaskInScope_set5OpenTaskWithMilestone_returnCount()
    {
        $m = new tasksTaskModel();
        $m->multipleInsert($this->getTestTasks());
        $result = $m->getCountTasksInScope();

        $this->assertEquals(array('milestone_id' => '1', 'closed' => '0', 'total' => '5'), $result[0]);
    }

    public function getTestTasks()
    {
        $task = array(
            array(
                'id'                  => '1',
                'name'                => 'Test task',
                'text'                => 'Test task text',
                'create_contact_id'   => '1',
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
                'create_contact_id'   => '1',
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
            ),
            array(
                'id'                  => '3',
                'name'                => 'Test task',
                'text'                => 'Test task text',
                'create_contact_id'   => '1',
                'create_datetime'     => '2018-05-18 11:22:01',
                'update_datetime'     => '2018-05-18 11:22:01',
                'assigned_contact_id' => '1',
                'project_id'          => '1',
                'number'              => '3',
                'status_id'           => '0',
                'parent_id'           => null,
                'priority'            => '0',
                'assign_log_id'       => null,
                'contact_id'          => null,
                'hidden_timestamp'    => '0',
                'milestone_id'        => '1',
            ),
            array(
                'id'                  => '4',
                'name'                => 'Test task',
                'text'                => 'Test task text',
                'create_contact_id'   => '1',
                'create_datetime'     => '2018-05-18 11:22:01',
                'update_datetime'     => '2018-05-18 11:22:01',
                'assigned_contact_id' => '1',
                'project_id'          => '1',
                'number'              => '4',
                'status_id'           => '0',
                'parent_id'           => null,
                'priority'            => '0',
                'assign_log_id'       => null,
                'contact_id'          => null,
                'hidden_timestamp'    => '0',
                'milestone_id'        => '1',
            ),
            array(
                'id'                  => '5',
                'name'                => 'Test task',
                'text'                => 'Test task text',
                'create_contact_id'   => '1',
                'create_datetime'     => '2018-05-18 11:22:01',
                'update_datetime'     => '2018-05-18 11:22:01',
                'assigned_contact_id' => '1',
                'project_id'          => '1',
                'number'              => '5',
                'status_id'           => '0',
                'parent_id'           => null,
                'priority'            => '0',
                'assign_log_id'       => null,
                'contact_id'          => null,
                'hidden_timestamp'    => '0',
                'milestone_id'        => '1',
            )
        );

        return $task;
    }

    public function tearDown()
    {
        waTestEnvironment::getInstance()->deleteTemporaryTables(array('tasks_task'));
    }
}