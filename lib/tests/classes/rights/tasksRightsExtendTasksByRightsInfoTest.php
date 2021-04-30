<?php
require_once(realpath(dirname(__FILE__).'/../../../../').'/init.php');
require_once(dirname(__FILE__).'/../../../../lib/classes/test.AuthUser.class.php');

/**
 * Class tasksRightsExtendTasksByRightsInfoTest
 */
class tasksRightsExtendTasksByRightsInfoTest extends PHPUnit_Framework_TestCase
{
    public function setUp()
    {
        wa('tasks');
        waTestEnvironment::getInstance()->setUpTemporaryTablesForApps(array('tasks', 'webasyst'));
    }

    public function testTasksRightsExtend_userAccessNone_canViewFalse()
    {
        //MODEL
        $tasks_rights = new tasksRights();

        //SET DATA
        wa()->setUser(new testAuthUser());
        wa()->getUser()->setTestRight('webasyst', 'backend', 0);
        wa()->getUser()->setTestRight('tasks', 'project.1', 0);
        $this->setTasks();
        $task = new tasksTask(1);
        $contact_id = wa()->getUser()->getId();

        //GET DATA
        $contacts = array($contact_id);
        $tasks = array($task);
        $tasks_rights->extendTasksByRightsInfo($tasks,$contacts);

        $updated_tasks= $tasks[0];
        $rights_info = $updated_tasks->rights_info;

        //ASSERT
        $this->assertFalse($rights_info[$contact_id]['can_view']);
    }

    public function testTasksRightsExtend_userAccessViewAssignedTasks_canViewTrue()
    {
        //MODEL
        $tasks_rights = new tasksRights();

        //SET DATA
        wa()->setUser(new testAuthUser());
        wa()->getUser()->setTestRight('tasks', 'backend', 1);
        wa()->getUser()->setTestRight('tasks', 'project.1', 1);
        $this->setTasks();
        $task = new tasksTask(1);
        $contact_id = wa()->getUser()->getId();

        //GET DATA
        $contacts = array($contact_id);
        $tasks = array($task);
        $tasks_rights->extendTasksByRightsInfo($tasks, $contacts);

        $updated_tasks= $tasks[0];
        $rights_info = $updated_tasks->rights_info;

        //ASSERT
        $this->assertTrue($rights_info[$contact_id]['can_view']);
    }

    /**
     * Test that author of task can view task even if has limited access to project
     * Author can view access if there are not comments/actions for this task done by other contacts
     * @throws waDbException
     */
    public function testTasksRightsExtend_limitedViewMovedTask_canViewTrue()
    {
        //
        $tasks_rights = new tasksRights();

        // current user (id = 1)
        wa()->setUser(new testAuthUser());

        // limited access to backend
        wa()->getUser()->setTestRight('tasks', 'backend', 1);

        // view access to only assigned tasks
        wa()->getUser()->setTestRight('tasks', 'project.1', tasksRights::PROJECT_ACCESS_VIEW_ASSIGNED_TASKS);

        // set up tasks and related logs
        $this->setTasks();
        $this->setLogs();

        $task = new tasksTask(2);               // belongs to project 1, assigned_contact_id = 100500 (not current)
        $contact_id = wa()->getUser()->getId();      // current contact id is 1 (not 100500)

        // for current task current user is author (creator) and there are not comment/actions to this task done by other contacts
        // so this is an exception situation, and not assigned contact (but author) can access to task

        // prepare data to call method
        $contacts = array($contact_id);
        $tasks = array($task);

        // extend by rights info
        $tasks_rights->extendTasksByRightsInfo($tasks, $contacts);

        // result data
        $updated_tasks = $tasks[0];
        $rights_info = $updated_tasks->rights_info;

        // in this particular situation author can view own task
        $this->assertTrue($rights_info[$contact_id]['can_view']);
    }

    /**
     * Test that author of task can NOT view task if has limited access to project
     * Opposite cast to testTasksRightsExtend_limitedViewMovedTask_canViewTrue
     * @see testTasksRightsExtend_limitedViewMovedTask_canViewTrue
     * @throws waDbException
     */
    public function testTasksRightsExtend_limitedViewMovedTask_canViewFalse()
    {
        //
        $tasks_rights = new tasksRights();

        // current user (id = 1)
        wa()->setUser(new testAuthUser());

        // limited access to backend
        wa()->getUser()->setTestRight('tasks', 'backend', 1);

        // view access to only assigned tasks
        wa()->getUser()->setTestRight('tasks', 'project.1', tasksRights::PROJECT_ACCESS_VIEW_ASSIGNED_TASKS);

        // set up tasks and related logs
        $this->setTasks();
        $this->setLogs();

        $task = new tasksTask(3);               // belongs to project 1, assigned_contact_id = 100500 (not current)
        $contact_id = wa()->getUser()->getId();      // current contact id is 1 (not 100500)

        // for current task current user is author (creator) and there is a comment/action to this task done by other contact (100500)
        // so this is now author must not have view access to these task

        // prepare data to call method
        $contacts = array($contact_id);
        $tasks = array($task);

        // extend by rights info
        $tasks_rights->extendTasksByRightsInfo($tasks, $contacts);

        // result data
        $updated_tasks = $tasks[0];
        $rights_info = $updated_tasks->rights_info;

        // author can view own task
        $this->assertFalse($rights_info[$contact_id]['can_view']);
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
                'assigned_contact_id' => wa()->getUser()->getId(),
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
                'assigned_contact_id' => '100500',
                'project_id'          => '1',
                'number'              => '2',
                'status_id'           => '0',
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
                'assigned_contact_id' => '100500',
                'project_id'          => '1',
                'number'              => '2',
                'status_id'           => '0',
                'parent_id'           => null,
                'priority'            => '0',
                'assign_log_id'       => null,
                'contact_id'          => null,
                'hidden_timestamp'    => '0',
            ),
        );

        $task_model = new tasksTaskModel();
        $task_model->multipleInsert(array_slice($task, $start, $length, true));

    }
    public function setLogs($length = null, $start = 0)
    {
        $task = array(
            array (
                'id' => '1',
                'project_id' => '1',
                'task_id' => '2',
                'contact_id' => wa()->getUser()->getId(),
                'text' => '',
                'create_datetime' => '2015-09-10 10:45:38',
                'before_status_id' => '0',
                'after_status_id' => '0',
                'action' => 'forward',
                'assigned_contact_id' => NULL,
            ),
            array(
                'id' => '2',
                'project_id' => '1',
                'task_id' => '3',
                'contact_id' => wa()->getUser()->getId(),
                'text' => '',
                'create_datetime' => '2015-09-10 10:45:38',
                'before_status_id' => '0',
                'after_status_id' => '0',
                'action' => 'forward',
                'assigned_contact_id' => NULL,
            ),
            array(
                'id' => '3',
                'project_id' => '1',
                'task_id' => '3',
                'contact_id' => '100500',
                'text' => '',
                'create_datetime' => '2015-09-10 10:46:38',
                'before_status_id' => '0',
                'after_status_id' => '0',
                'action' => 'forward',
                'assigned_contact_id' => NULL,
            )
        );

        $task_model = new tasksTaskLogModel();
        $task_model->multipleInsert(array_slice($task, $start, $length, true));

    }

    public function tearDown()
    {
        waTestEnvironment::getInstance()->tearDownTemporaryTablesForApps();
    }
}
