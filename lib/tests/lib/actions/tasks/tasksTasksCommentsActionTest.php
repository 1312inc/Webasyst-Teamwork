<?php
require_once(dirname(__FILE__).'/../../../../../init.php');

class tasksTasksCommentsActionTest extends PHPUnit_Framework_TestCase
{
    public function setUp()
    {
        wa('tasks');
        waTestEnvironment::getInstance()->setUpEmptyTemporaryTables(array('tasks_task', 'tasks_task_log'));
    }

    public function testAssignAction_postValidValue_assignComment()
    {   //Set Data
        $_POST['task_id'] = 1;
        $_POST['log_id'] = 100500;
        $this->setTask();

        //Model
        $task_model = new tasksTaskModel();
        $comment_action = new tasksTasksCommentsActions();

        //Prepare Data
        $comment_action->assignAction();
        $task = $task_model->getById(1);

        //Assert
        $this->assertEquals($_POST['log_id'], $task['comment_log_id']);
    }

    public function testAssignAction_postInvalidValue_assignComment()
    {   //Set Data
        $_POST['task_id'] = 0;
        $_POST['log_id'] = 100500;

        //Model
        $fake_comment_action = new fakeTasksTasksCommentsActions();

        //Prepare Data
        $fake_comment_action->assignAction();

        //Assert
        $this->assertNotEmpty($fake_comment_action->errors);
    }

    public function setTask()
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
        );
        $task_model = new tasksTaskModel();
        $task_model->multipleInsert($task);
    }

    public function tearDown()
    {
        wa('tasks');
        waTestEnvironment::getInstance()->deleteTemporaryTables(array('tasks_task', 'tasks_task_log'));
    }
}

wa('tasks');

class fakeTasksTasksCommentsActions extends tasksTasksCommentsActions
{
    public $errors;
}

