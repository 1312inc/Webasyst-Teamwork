<?php

require_once(dirname(__FILE__).'/../../../../../../init.php');
require_once(dirname(__FILE__).'/../../../../../../lib/classes/test.AuthUser.class.php');

class tasksTasksInfoActionTest extends PHPUnit_Framework_TestCase
{
    protected $table = array('wa_contact', 'wa_contact_rights', 'tasks_task', 'tasks_task_log', 'tasks_task_log_params', 'tasks_tag');
    public function setUp()
    {
        wa()->setUser(new testAuthUser());
        waTestEnvironment::getInstance()->setUpEmptyTemporaryTables($this->table);
    }

    public function testTasksInfo__TaskNotFound__ShowException()
    {
        $this->setDataTo_GET(array('n' => '1.222222'));

        $action = new tasksTasksInfoActionChange();

        $thrown = false;
        try {
            $action->execute();
        } catch (waException $e) {
            $thrown = true;
        }

        $this->assertTrue($thrown);
    }


    public function testTasksInfo__NotAccess__ShowException()
    {
        $this->setTask();
        $this->setDataTo_GET(array('id' => 1));

        $action = new tasksTasksInfoActionChange();

        $thrown = false;
        try {
            $action->execute();
        } catch (waException $e) {
            $thrown = true;
        }

        $this->assertTrue($thrown);
    }

    public function testTasksInfo__ViewTask__searchOldData()
    {
        $this->setTask();
        $this->setRights();
        $this->setDataTo_GET(array('id' => 1));

        $action = new tasksTasksInfoActionChange();
        $action->execute();

        $assign = $action->view->assign['task'];

        $this->assertEquals('1', $assign['value']['id']);
    }

    public function testTasksInfo__ViewMovedTask__SearchNewData()
    {
        $this->setTask();
        $this->setRights();
        $this->setDataTo_GET(array('n' => '1.488'));
        $this->setTaskLogParams();

        $action = new tasksTasksInfoActionChange();
        $action->execute();

        $assign = $action->view->assign['task'];

        $this->assertEquals('1', $assign['value']['id']);
    }

    public function setDataTo_GET($data)
    {
        if ($data) {
            foreach ($data as $key => $value) {
                $_GET[$key] = $value;
            }
        }
    }

    public function setRights()
    {
        $rights = array(
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'backend',
                'value'    => 2,
            ),
        );

        $rights_model = new waContactRightsModel();
        $rights_model->multipleInsert($rights);
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
            array(
                'id'                  => '22',
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
            )
        );
        $task_model = new tasksTaskModel();
        $task_model->multipleInsert($task);
    }

    public function setTaskLogParams()
    {
        $params = array(
            array(
                'task_id' => '1',
                'log_id'  => '1',
                'name'    => 'prev.project.number',
                'value'   => '1.488'
            )
        );

        $task_log_params_model = new tasksTaskLogParamsModel();

        $task_log_params_model->multipleInsert($params);
    }

    public function tearDown()
    {
        waTestEnvironment::getInstance()->deleteTemporaryTables($this->table);
    }
}


wa('tasks');

class tasksTasksInfoActionChange extends tasksTasksInfoAction
{
    public $view;

    public function __construct($params = null)
    {
        $this->view = new viewChange();
    }
}

class viewChange extends waSmarty3View
{
    public $assign;

    public function __construct()
    {

    }

    public function assign($name, $value = null, $escape = false)
    {
        if ($escape) {
            if (is_array($value)) {
                $value = array_map('htmlspecialchars', $value);
            } else {
                $value = htmlspecialchars($value);
            }
        }

        $this->assign[$name]['value'] = $value;
    }

}
