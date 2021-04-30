<?php
require_once(dirname(__FILE__).'/../../../../init.php');
require_once(dirname(__FILE__).'/../../../../lib/classes/test.AuthUser.class.php');

/**
 * Class tasksConfigExplainLogsTest
 * @requires extension skip
 * @group long_tests
 */
class tasksConfigExplainLogsTest extends PHPUnit_Framework_TestCase
{
    protected $logs;
    protected $delete_task_ids;
    protected $tables;

    public function setUp()
    {
        wa()->setUser(new testAuthUser());
        $this->tables = array('wa_contact', 'wa_log', 'tasks_task', 'wa_contact_rights', 'tasks_project');
        waTestEnvironment::getInstance()->setUpEmptyTemporaryTables($this->tables);

        wa('tasks');
        $tasks_task_model = new tasksTaskModel();
        $tasks_project_model = new tasksProjectModel();

        $tasks_project_model->multipleInsert($this->getProject());

        foreach ($this->getTasks() as $task) {
            $new_task = $tasks_task_model->add($task);
            $this->delete_task_ids[] = $new_task['id'];
        }

        foreach ($this->delete_task_ids as $id) {
            $this->logs[] = array(
                'app_id'     => 'tasks',
                'contact_id' => wa()->getUser()->getId(),
                'datetime'   => date('Y-m-d H:i:s'),
                'action'     => 'task_add',
                'params'     => $id
            );
        }
    }

    public function testNotAccessRightUser()
    {
        $logs = wa('tasks', 1)->getConfig()->explainLogs($this->logs);
        $this->assertEquals($logs, array(
            0 => null,
            1 => null,
            2 => null,
            3 => null,
            4 => null
        ), 'Not Access Right user view logs');
    }

    public function testRightAssignedToOneProjectUser()
    {
        $rights_model = new waContactRightsModel();

        $rights_model->multipleInsert(array(
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'project.1',
                'value'    => 1,
            ),
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'backend',
                'value'    => 1,
            )
        ));

        $logs = wa('tasks', 1)->getConfig()->explainLogs($this->logs);

        $this->assertNotEmpty($logs[0]);
        $this->assertEmpty($logs[1]);
        $this->assertNotEmpty($logs[2]);
        $this->assertEmpty($logs[3]);
        $this->assertEmpty($logs[4]);

        $this->clearRightsTable();
    }

    public function testRightAssignedToTwoProjectUser()
    {
        $rights_model = new waContactRightsModel();

        $rights_model->multipleInsert(array(
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'project.1',
                'value'    => 1,
            ),
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'project.2',
                'value'    => 1,
            ),
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'backend',
                'value'    => 1,
            )
        ));

        $logs = wa('tasks', 1)->getConfig()->explainLogs($this->logs);

        $this->assertNotEmpty($logs[0]);
        $this->assertNotEmpty($logs[1]);
        $this->assertNotEmpty($logs[2]);
        $this->assertNotEmpty($logs[3]);
        $this->assertEmpty($logs[4]);

        $this->clearRightsTable();
    }

    public function testFullRightToOneProject()
    {
        $rights_model = new waContactRightsModel();

        $rights_model->multipleInsert(array(
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'project.2',
                'value'    => 2,
            ),
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'backend',
                'value'    => 1,
            )
        ));

        $logs = wa('tasks', 1)->getConfig()->explainLogs($this->logs);

        $this->assertEmpty($logs[0]);
        $this->assertNotEmpty($logs[1]);
        $this->assertEmpty($logs[2]);
        $this->assertNotEmpty($logs[3]);
        $this->assertNotEmpty($logs[4]);

        $this->clearRightsTable();
    }

    public function testFullRightToOneProjectAndAssignRightToOne()
    {
        $rights_model = new waContactRightsModel();

        $rights_model->multipleInsert(array(
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'project.2',
                'value'    => 2,
            ),
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'project.1',
                'value'    => 1,
            ),
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'backend',
                'value'    => 1,
            )
        ));

        $logs = wa('tasks', 1)->getConfig()->explainLogs($this->logs);

        $this->assertNotEmpty($logs[0]);
        $this->assertNotEmpty($logs[1]);
        $this->assertNotEmpty($logs[2]);
        $this->assertNotEmpty($logs[3]);
        $this->assertNotEmpty($logs[4]);

        $this->clearRightsTable();
    }

    public function testTasksAdminUser()
    {
        $rights_model = new waContactRightsModel();

        $rights_model->insert(
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'backend',
                'value'    => 2,
            )
        );

        $logs = wa('tasks', 1)->getConfig()->explainLogs($this->logs);

        $this->assertNotEmpty($logs[0]);
        $this->assertNotEmpty($logs[1]);
        $this->assertNotEmpty($logs[2]);
        $this->assertNotEmpty($logs[3]);
        $this->assertNotEmpty($logs[4]);
    }

    protected function clearRightsTable()
    {
        $rights_model = new waContactRightsModel();
        $rights_model->deleteByField(array('group_id' => '-'.wa()->getUser()->getId()));
    }

    protected function getTasks($length = null, $start = 0)
    {
        $tasks = array(
            array(
                'project_id'          => '1',
                'create_contact_id'   => wa()->getUser()->getId(),
                'name'                => 'Тестовая задача',
                'text'                => 'Тестовая задача',
                'assigned_contact_id' => wa()->getUser()->getId(),
                'milestone_id'        => 0,
            ),
            array(
                'project_id'          => '2',
                'create_contact_id'   => wa()->getUser()->getId(),
                'name'                => 'Тестовая задача 1',
                'text'                => 'Тестовая задача 1',
                'assigned_contact_id' => wa()->getUser()->getId(),
                'milestone_id'        => 0,
            ),
            array(
                'project_id'          => '1',
                'create_contact_id'   => wa()->getUser()->getId(),
                'name'                => 'Тестовая задача 2',
                'text'                => 'Тестовая задача 2',
                'assigned_contact_id' => wa()->getUser()->getId(),
                'milestone_id'        => 0,
            ),
            array(
                'project_id'          => '2',
                'create_contact_id'   => wa()->getUser()->getId(),
                'name'                => 'Тестовая задача 3',
                'text'                => 'Тестовая задача 3',
                'assigned_contact_id' => wa()->getUser()->getId(),
                'milestone_id'        => 0,
            ),
            array(
                'project_id'          => '2',
                'create_contact_id'   => 5,
                'name'                => 'Тестовая задача 4',
                'text'                => 'Тестовая задача 4',
                'assigned_contact_id' => 100,
                'milestone_id'        => 0,
            )

        );

        if ($length > 0) {
            return array_slice($tasks, $start, $length, true);
        }

        return $tasks;
    }

    protected function getProject($length = null, $start = 0)
    {
        $project = array(
            array(
                'id'               => '1',
                'name'             => 'Тест 1',
                'contact_id'       => '1',
                'create_datetime'  => '2017-10-30 16:39:22',
                'tasks_number'     => '302',
                'icon'             => 'blog',
                'color'            => '',
                'archive_datetime' => null,
                'sort'             => '0',
                'icon_url'         => false,
                'icon_class'       => 'blog',
                'icon_html'        => '<i class="icon16 blog" title="Вебасист"></i>',
            ),
            array(
                'id'               => '2',
                'name'             => 'Тест 2',
                'contact_id'       => '1',
                'create_datetime'  => '2017-10-30 16:39:22',
                'tasks_number'     => '302',
                'icon'             => 'blog',
                'color'            => '',
                'archive_datetime' => null,
                'sort'             => '0',
                'icon_url'         => false,
                'icon_class'       => 'blog',
                'icon_html'        => '<i class="icon16 blog" title="Вебасист"></i>',
            )
        );

        if ($length > 0) {
            return array_slice($project, $start, $length, true);
        }
        return $project;
    }

    public function tearDown()
    {
        waTestEnvironment::getInstance()->deleteTemporaryTables($this->tables);
    }
}

