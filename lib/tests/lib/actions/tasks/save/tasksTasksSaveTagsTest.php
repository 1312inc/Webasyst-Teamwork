<?php
require_once(dirname(__FILE__).'/../../../../../../init.php');

class tasksTasksSaveTagsTest extends PHPUnit_Framework_TestCase
{
    public function setUp()
    {
        wa('tasks');
        waTestEnvironment::getInstance()->setUpEmptyTemporaryTables(array('tasks_task_tags', 'tasks_tag'));
    }

    public function testTasksSaveTags_addNewTask_AcceptEqual()
    {
        $tasks_tags_model = new tasksTaskTagsModel();
        $task_save_cntr = new testTasksTasksSaveController();

        $tasks = $this->getTasks();
        $task_save_cntr->saveTags($tasks[0]);

        $tags = $tasks_tags_model->getAll();

        $this->assertEquals(2, count($tags));
    }

    public function testTasksSaveTags_editTaskWithoutHeaderTags_AcceptEqual()
    {
        $tasks_task_tags_model = new tasksTaskTagsModel();
        $tasks_tags_model = new tasksTaskModel();
        $task_save_cntr = new testTasksTasksSaveController();

        $tasks_task_tags_model->multipleInsert($this->getTagsData(3));
        $tasks_tags_model->multipleInsert($this->getTagsData(3));

        $tasks = $this->getTasks();
        //set old text tags
        $prev_task = $tasks[0];
        $prev_task['text'] = '#test1';

        $task_save_cntr->saveTags($tasks[0], $prev_task);

        $tags = $tasks_task_tags_model->getAll();

        $this->assertEquals(2, count($tags));
    }

    public function testTasksSaveTags_editTaskWithHeaderTags_AcceptEqual()
    {
        $tasks_task_tags_model = new tasksTaskTagsModel();
        $tasks_tags_model = new tasksTagModel();
        $task_save_cntr = new testTasksTasksSaveController();

        $tasks_task_tags_model->multipleInsert($this->getTags(3));

        $tasks_tags_model->multipleInsert($this->getTagsData(3));

        $tasks = $this->getTasks();
        //set old text tags
        $prev_task = $tasks[0];
        $prev_task['text'] = '#test1';

        $task_save_cntr->saveTags($tasks[0], $prev_task);

        $tags = $tasks_task_tags_model->getAll();

        $this->assertEquals(4, count($tags));
    }

    protected function getTags($length = null, $start = 0)
    {
        $tags = array(
            array(
                'tag_id'  => 1,
                'task_id' => 1,
            ),
            array(
                'tag_id'  => 2,
                'task_id' => 1,
            ),
            array(
                'tag_id'  => 3,
                'task_id' => 1,
            )
        );

        if ($length > 0) {
            return array_slice($tags, $start, $length, true);
        }

        return $tags;
    }

    protected function getTagsData($length = null, $start = 0)
    {
        $tags_data = array(
            array(
                'id'   => 1,
                'name' => 'test0',
                'favorite'
            ),
            array(
                'id'   => 2,
                'name' => 'test1',
                'favorite'
            ),
            array(
                'id'   => 3,
                'name' => 'test2',
                'favorite'
            )
        );

        if ($length > 0) {
            return array_slice($tags_data, $start, $length, true);
        }

        return $tags_data;
    }

    protected function getTasks($length = null, $start = 0)
    {
        $tasks = array(
            array(
                'id'                  => '1',
                'name'                => 'Тестовая задач',
                'text'                => '#tag #tag1',
                'create_contact_id'   => '9',
                'create_datetime'     => '2018-05-17 08:58:26',
                'update_datetime'     => '2018-05-17 08:58:26',
                'assigned_contact_id' => '1',
                'project_id'          => '1',
                'milestone_id'        => '0',
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
                'name'                => 'Тестовая задачa 2',
                'text'                => 'Тестовый текст #tag3 #tag4',
                'create_contact_id'   => '9',
                'create_datetime'     => '2018-05-17 08:58:26',
                'update_datetime'     => '2018-05-17 08:58:26',
                'assigned_contact_id' => '1',
                'project_id'          => '1',
                'milestone_id'        => '0',
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
                'name'                => 'Тестовая задач',
                'text'                => 'Тестовый текст',
                'create_contact_id'   => '9',
                'create_datetime'     => '2018-05-17 08:58:26',
                'update_datetime'     => '2018-05-17 08:58:26',
                'assigned_contact_id' => '1',
                'project_id'          => '1',
                'milestone_id'        => '0',
                'number'              => '3',
                'status_id'           => '0',
                'parent_id'           => null,
                'priority'            => '0',
                'assign_log_id'       => null,
                'contact_id'          => null,
                'hidden_timestamp'    => '0',
            ),
        );

        if ($length > 0) {
            return array_slice($tasks, $start, $length, true);
        }

        return $tasks;
    }

    public function tearDown()
    {
        waTestEnvironment::getInstance()->deleteTemporaryTables(array('tasks_task_tags', 'tasks_tag'));
    }
}

wa('tasks');

class testTasksTasksSaveController extends tasksTasksSaveController
{
    public function saveTags($task, $prev_task = null)
    {
        parent::saveTags($task, $prev_task);
    }
}