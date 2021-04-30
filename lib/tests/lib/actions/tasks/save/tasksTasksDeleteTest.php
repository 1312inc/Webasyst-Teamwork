<?php

require_once(dirname(__FILE__).'/../../../../../../init.php');
require_once(dirname(__FILE__).'/../../../../../../lib/classes/test.AuthUser.class.php');

wa('tasks');

/**
 * Class tasksTasksDeleteTest
 */
class tasksTasksDeleteTest extends PHPUnit_Framework_TestCase
{
    protected $table = array(
        'wa_contact',
        'wa_contact_rights',
        'tasks_project',
        'tasks_task'
    );

    public function setUp()
    {
        waTestEnvironment::getInstance()->setUpEmptyTemporaryTables($this->table);

        wa()->setUser(new testAuthUser());

        $project_model = new tasksProjectModel();
        $project_model->multipleInsert($this->getProject(2));

        $task_model = new tasksTaskModel();
        $tested_tasks = $this->getTasks();
        foreach ($tested_tasks as $t) {
            $t['create_datetime'] = date("Y-m-d H:i:s");
            $t['update_datetime'] = $t['create_datetime'];
            $task_model->insert($t);
        }
    }

    public function testDelete_userHaveFullRights_Access()
    {
        $rights_model = new waContactRightsModel();
        $rights_model->multipleInsert(array(
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'backend',
                'value'    => 2,
            ),
        ));

        $tested_tasks = $this->getTasks(8);
        $tested_task_ids = array_keys($tested_tasks);

        $tasks_delete_controller = new tasksTasksDeleteControllerMock();
        $tasks_delete_controller->setPostData(array(
            'id' => $tested_task_ids
        ));

        $tasks_ids = $tasks_delete_controller->getTaskIds();

        sort($tasks_ids, SORT_NUMERIC);     // prevent order influence on equal
        $this->assertEquals(array(100, 101, 102, 103, 104, 105, 106, 107), $tasks_ids);

    }

    public function testDelete_userHaveManageRightsToProject1_Access()
    {
        $rights_model = new waContactRightsModel();

        $rights_model->multipleInsert(array(
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'backend',
                'value'    => 1,
            ),
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'project.1',
                'value'    => 2,    // full access
            ),
        ));

        $tested_tasks = $this->getTasks(8);
        $tested_task_ids = array_keys($tested_tasks);

        $tasks_delete_controller = new tasksTasksDeleteControllerMock();
        $tasks_delete_controller->setPostData(array(
            'id' => $tested_task_ids
        ));

        $tasks_ids = $tasks_delete_controller->getTaskIds();

        sort($tasks_ids, SORT_NUMERIC);     // prevent order influence on equal
        $this->assertEquals(array(100, 101, 102, 103), $tasks_ids);

    }

    public function testDelete_userHaveManageRightsToProject1AndProject2_Access()
    {
        $rights_model = new waContactRightsModel();

        $rights_model->multipleInsert(array(
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'backend',
                'value'    => 1,
            ),
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'project.1',
                'value'    => 2,
            ),
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'project.2',
                'value'    => 2,
            ),
        ));

        $tested_tasks = $this->getTasks(8);
        $tested_task_ids = array_keys($tested_tasks);

        $tasks_delete_controller = new tasksTasksDeleteControllerMock();
        $tasks_delete_controller->setPostData(array(
            'id' => $tested_task_ids
        ));

        $tasks_ids = $tasks_delete_controller->getTaskIds();

        sort($tasks_ids, SORT_NUMERIC);     // prevent order influence on equal
        $this->assertEquals(array(100, 101, 102, 103, 104, 105, 106, 107), $tasks_ids);

    }

    public function testDelete_userHaveAvailableRightsToProject1_Access()
    {
        $rights_model = new waContactRightsModel();

        $rights_model->multipleInsert(array(
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'backend',
                'value'    => 1,
            ),
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'project.1',

                // limited access, but author of task can access to task if there are not comments/actions for these task by other contacts
                // see tasksRights::extendTasksByRightsInfo

                'value'    => 1,
            ),
        ));

        $tested_tasks = $this->getTasks(8);
        $tested_task_ids = array_keys($tested_tasks);

        $tasks_delete_controller = new tasksTasksDeleteControllerMock();
        $tasks_delete_controller->setPostData(array(
            'id' => $tested_task_ids
        ));

        $tasks_ids = $tasks_delete_controller->getTaskIds();
        sort($tasks_ids, SORT_NUMERIC);     // prevent order influence on equal
        $this->assertEquals(array(100, 101), $tasks_ids);

    }

    public function testDelete_userHaveAvailableRightsToProject1AndProject2_Access()
    {
        $rights_model = new waContactRightsModel();

        $rights_model->multipleInsert(array(
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'backend',
                'value'    => 1,
            ),
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'project.1',

                // limited access, but author of task can access to task if there are not comments/actions for these task by other contacts
                // see tasksRights::extendTasksByRightsInfo
                'value'    => 1,
            ),
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'project.2',

                // limited access, but author of task can access to task if there are not comments/actions for these task by other contacts
                // see tasksRights::extendTasksByRightsInfo
                'value'    => 1,
            ),
        ));

        $tested_tasks = $this->getTasks(8);
        $tested_task_ids = array_keys($tested_tasks);

        $tasks_delete_controller = new tasksTasksDeleteControllerMock();
        $tasks_delete_controller->setPostData(array(
            'id' => $tested_task_ids
        ));

        $tasks_ids = $tasks_delete_controller->getTaskIds();

        sort($tasks_ids, SORT_NUMERIC);     // prevent order influence on equal
        $this->assertEquals(array(100, 101, 104, 105), $tasks_ids);
    }

    public function testDelete_userHaveAvailableRightsToProject1AndMangeRightToProject2_Access()
    {
        $rights_model = new waContactRightsModel();

        $rights_model->multipleInsert(array(
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'backend',
                'value'    => 1,
            ),
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'project.1',

                // limited access, but author of task can access to task if there are not comments/actions for these task by other contacts
                // see tasksRights::extendTasksByRightsInfo
                'value'    => 1,
            ),
            array(
                'group_id' => '-'.wa()->getUser()->getId(),
                'app_id'   => 'tasks',
                'name'     => 'project.2',

                // full access
                'value'    => 2,
            ),
        ));

        $tested_tasks = $this->getTasks(8);
        $tested_task_ids = array_keys($tested_tasks);

        $tasks_delete_controller = new tasksTasksDeleteControllerMock();
        $tasks_delete_controller->setPostData(array(
            'id' => $tested_task_ids
        ));

        $tasks_ids = $tasks_delete_controller->getTaskIds();

        sort($tasks_ids, SORT_NUMERIC);     // prevent order influence on equal
        $this->assertEquals(array(100, 101, 104, 105, 106, 107), $tasks_ids);
    }

    public function testDelete_userNotHaveRightsToTasks_Access()
    {
        $tested_tasks = $this->getTasks(8);
        $tested_task_ids = array_keys($tested_tasks);

        $tasks_delete_controller = new tasksTasksDeleteControllerMock();
        $tasks_delete_controller->setPostData(array(
            'id' => $tested_task_ids
        ));

        $tasks_ids = $tasks_delete_controller->getTaskIds();

        $this->assertEquals(array(), $tasks_ids);
    }

    protected function getTasks($length = null, $start = 0)
    {
        $tasks = array(
            100 =>
                array(
                    'id'                  => '100',
                    'name'                => 'Тестовая задача',
                    'text'                => 'Тестовый текст',
                    'create_contact_id'   => wa()->getUser()->getId(),
                    'assigned_contact_id' => wa()->getUser()->getId(),
                    'project_id'          => '1',
                    'number'              => '100',
                ),
            101 =>
                array(
                    'id'                  => '101',
                    'name'                => 'Тестовая задача',
                    'text'                => 'Тестовый текст',
                    'create_contact_id'   => wa()->getUser()->getId(),
                    'assigned_contact_id' => '42',
                    'project_id'          => '1',
                    'number'              => '101',
                ),
            102 =>
                array(
                    'id'                  => '102',
                    'name'                => 'Тестовая задача',
                    'text'                => 'Тестовый текст',
                    'create_contact_id'   => '42',
                    'assigned_contact_id' => wa()->getUser()->getId(),
                    'project_id'          => '1',
                    'number'              => '102',
                ),
            103 =>
                array(
                    'id'                  => '103',
                    'name'                => 'Тестовая задача',
                    'text'                => 'Тестовый текст',
                    'create_contact_id'   => '42',
                    'assigned_contact_id' => '42',
                    'project_id'          => '1',
                    'number'              => '103',
                ),
            104 =>
                array(
                    'id'                  => '104',
                    'name'                => 'Тестовая задача',
                    'text'                => 'Тестовый текст',
                    'create_contact_id'   => wa()->getUser()->getId(),
                    'assigned_contact_id' => wa()->getUser()->getId(),
                    'project_id'          => '2',
                    'number'              => '104',
                ),
            105 =>
                array(
                    'id'                  => '105',
                    'name'                => 'Тестовая задача',
                    'text'                => 'Тестовый текст',
                    'create_contact_id'   => wa()->getUser()->getId(),
                    'assigned_contact_id' => '42',
                    'project_id'          => '2',
                    'number'              => '105',
                ),
            106 =>
                array(
                    'id'                  => '106',
                    'name'                => 'Тестовая задача',
                    'text'                => 'Тестовый текст',
                    'create_contact_id'   => '42',
                    'assigned_contact_id' => wa()->getUser()->getId(),
                    'project_id'          => '2',
                    'number'              => '106',
                ),
            107 =>
                array(
                    'id'                  => '107',
                    'name'                => 'Тестовая задача',
                    'text'                => 'Тестовый текст',
                    'create_contact_id'   => '42',
                    'assigned_contact_id' => '42',
                    'project_id'          => '2',
                    'number'              => '107',
                ),
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

    protected function clearRightsTable()
    {
        $rights_model = new waContactRightsModel();
        $rights_model->deleteByField(array('group_id' => '-'.wa()->getUser()->getId()));
    }

    public function tearDown()
    {
        waTestEnvironment::getInstance()->deleteTemporaryTables($this->table);
    }
}

/**
 * Class tasksTasksDeleteControllerMock
 * To get access to protected methods
 */
class tasksTasksDeleteControllerMock extends tasksTasksDeleteController
{
    public function setPostData($data = array())
    {
        $_POST = $data;
    }

    public function getTaskIds()
    {
        return parent::getTaskIds();
    }
}
