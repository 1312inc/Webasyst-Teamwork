<?php
require_once(realpath(dirname(__FILE__).'/../../../').'/init.php');

class tasksTagModelTest extends PHPUnit_Framework_TestCase
{
    public function setUp()
    {
        wa('tasks');
        waTestEnvironment::getInstance()->setUpEmptyTemporaryTables(array('tasks_tag', 'tasks_task_tags'));
    }

    public function testDeleteUnusedTags_noUnused_nothingWillRemove()
    {
        $task_tag = new tasksTagModel();
        $task_tag->multipleInsert(array(
            array('id' => 1, 'name' => 'Test'),
            array('id' => 2, 'name' => 'Test 2'),
        ));

        $task_task_tag = new tasksTaskTagsModel();
        $task_task_tag->multipleInsert(array(
            array('task_id' => 1, 'tag_id' => 1),
            array('task_id' => 1, 'tag_id' => 2),
        ));

        $task_tag->deleteUnusedTags();
        $result = $task_tag->getAll('id');

        $this->assertEquals(array(1,2),array_keys($result) );
    }

    public function testDeleteUnusedTags_oneUnused_oneTagRemove()
    {
        $task_tag = new tasksTagModel();
        $task_tag->multipleInsert(array(
            array('id' => 1, 'name' => 'Test'),
            array('id' => 2, 'name' => 'Test 2'),
        ));

        $task_task_tag = new tasksTaskTagsModel();
        $task_task_tag->multipleInsert(array(
            array('task_id' => 1, 'tag_id' => 1),
        ));

        $task_tag->deleteUnusedTags();
        $result = $task_tag->getAll('id');

        $this->assertEquals(array(1),array_keys($result) );
    }

    public function testDeleteUnusedTags_allUnused_allTagRemove()
    {
        $task_tag = new tasksTagModel();
        $task_tag->multipleInsert(array(
            array('id' => 1, 'name' => 'Test'),
            array('id' => 2, 'name' => 'Test 2'),
        ));

        $task_tag->deleteUnusedTags();
        $result = $task_tag->getAll('id');

        $this->assertEmpty($result);
    }

    public function tearDown()
    {
        waTestEnvironment::getInstance()->deleteTemporaryTables(array('tasks_tag', 'tasks_task_tags'));
    }
}