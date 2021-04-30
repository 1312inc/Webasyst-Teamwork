<?php

require_once(dirname(__FILE__).'/../../tasksTestCase.php');

class tasksTaskTagsModelTest extends tasksTestCase
{
    public function testSaveTags1()
    {
        $task = $this->createTask();
        $task_id = $task['id'];

        $tags = array(
            "UnitTestTag1",
            "UnitTestTag2",
            "UnitTestTag3"
        );
        self::addResources('tags', $tags);

        $ttm = new tasksTaskTagsModel();
        $ttm->save($task['id'], $tags);

        sort($tags);
        $task = new tasksTask($task_id);
        $this->assertEquals($tags, array_values($task->getTags()));

        $tags = array(
            "UnitTestTag3",
            "UnitTestTag4",
            "UnitTestTag5",
        );
        self::addResources('tags', $tags);

        $ttm->save($task['id'], $tags);
        sort($tags);
        $task = new tasksTask($task_id);
        $this->assertEquals($tags, array_values($task->getTags()));
    }

    public function testSaveTags2()
    {
        $task = $this->createTask();
        $task_id = $task['id'];

        $tags1 = array(
            "UnitTestTag1",
            "UnitTestTag2",
            "UnitTestTag3"
        );
        self::addResources('tags', $tags1);

        $ttm = new tasksTaskTagsModel();
        $ttm->save($task['id'], $tags1);

        sort($tags1);
        $task = new tasksTask($task_id);
        $this->assertEquals($tags1, array_values($task->getTags()));

        $tags2 = array(
            "UnitTestTag3",
            "UnitTestTag4",
            "UnitTestTag5",
        );
        self::addResources('tags', $tags2);

        $ttm->save($task['id'], $tags2, false);

        $tags = array_merge($tags1, $tags2);
        $tags = array_unique($tags);
        sort($tags);


        $task = new tasksTask($task_id);
        $this->assertEquals($tags, array_values($task->getTags()));

    }
}
