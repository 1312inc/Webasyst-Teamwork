<?php
require_once(realpath(dirname(__FILE__).'/../../../../../').'/init.php');
require_once(dirname(__FILE__).'/../../../../../lib/classes/test.AuthUser.class.php');

/**
 * Class tasksTaskCollectionSortByStatusTest
 * @group long_tests
 */
class tasksTaskCollectionSortByStatusTest extends PHPUnit_Framework_TestCase
{
    public function setUp()
    {
        wa('tasks');
        waTestEnvironment::getInstance()->setUpTemporaryTablesForApps(array('tasks','webasyst'));
    }


    public function testGetTasks_statusAll_returnAllTask()
    {
        //Model
        $c = new tasksCollection();

        //Set Data
        $this->setTasks(3);
        $filters = 'status_id=all';
        $c->filter($filters);
        wa()->setUser(new testAuthUser());
        wa()->getUser()->setRight('webasyst', 'backend', 2);

        //Get data
        $data = $c->getTasks();

        //Assert
        $this->assertEquals(3,count($data));
    }

    public function testGetTasks_status0_returnInWorkTask()
    {
        //Model
        $c = new tasksCollection();

        //Set Data
        $this->setTasks(3);
        $filters = 'status_id=0';
        $c->filter($filters);
        wa()->setUser(new testAuthUser());
        wa()->getUser()->setRight('webasyst', 'backend', 2);

        //Get data
        $data = $c->getTasks();

        //Assert
        $this->assertEquals(1,count($data));
    }

    public function testGetTasks_customStatus_returnSpecifiedTask()
    {
        //Model
        $c = new tasksCollection();

        //Set Data
        $this->setTasks(3);
        $filters = 'status_id=100500';
        $c->filter($filters);
        wa()->setUser(new testAuthUser());
        wa()->getUser()->setRight('webasyst', 'backend', 2);

        //Get data
        $data = $c->getTasks();

        //Assert
        $this->assertEquals(1,count($data));
    }

    public function testGetTasks_unassignedStatus_returnOnlyOpenTask()
    {
        //Model
        $c = new tasksCollection('unassigned');

        //Set Data
        $this->setTasks(1, 3);
        $this->setProject(2);

        wa()->setUser(new testAuthUser());
        wa()->getUser()->setRight('webasyst', 'backend', 2);

        //Get data
        $data = $c->getTasks();

        //Assert
        $this->assertEquals(1,count($data));
    }

    public function tearDown()
    {
        waTestEnvironment::getInstance()->tearDownTemporaryTablesForApps();
    }


    public function setTasks($length = null, $start = 0)
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
                'status_id'           => '-1',
                'parent_id'           => null,
                'priority'            => '0',
                'assign_log_id'       => null,
                'contact_id'          => null,
                'hidden_timestamp'    => '0',
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
                'status_id'           => '100500',
                'parent_id'           => null,
                'priority'            => '0',
                'assign_log_id'       => null,
                'contact_id'          => null,
                'hidden_timestamp'    => '0',
            ),
            array(
                'id'                  => '4',
                'name'                => 'Test task',
                'text'                => 'Test task text',
                'create_contact_id'   => '1',
                'create_datetime'     => '2018-05-18 11:22:01',
                'update_datetime'     => '2018-05-18 11:22:01',
                'assigned_contact_id' => null,
                'project_id'          => '100500',
                'number'              => '4',
                'status_id'           => '0',
                'parent_id'           => null,
                'priority'            => '0',
                'assign_log_id'       => null,
                'contact_id'          => null,
                'hidden_timestamp'    => '0',
            )
        );

        $slice = array_slice($task, $start, $length, true);
        $insert = array_values($slice);

        $task_model = new tasksTaskModel();
        $task_model->multipleInsert($insert);

    }
    public function setProject($length = null, $start = 0)
    {
        $project = array(
            array (
                'id' => '1',
                'name' => 'Test 1',
                'contact_id' => '837576',
                'create_datetime' => '2015-09-10 10:40:51',
                'tasks_number' => '1968',
                'icon' => 'https://www.webasyst.com/wa-apps/tasks/img/tasks96.png',
                'color' => 't-red',
                'archive_datetime' => NULL,
                'sort' => '0',
            ),
            array (
                'id' => '100500',
                'name' => 'Archive',
                'contact_id' => '870773',
                'create_datetime' => '2004-03-09 00:00:00',
                'tasks_number' => '25',
                'icon' => 'blog',
                'color' => 't-white',
                'archive_datetime' => NULL,
                'sort' => '0',
            )
        );

        $slice = array_slice($project, $start, $length, true);
        $insert = array_values($slice);

        $task_model = new tasksProjectModel();
        $task_model->multipleInsert($insert);

    }
}