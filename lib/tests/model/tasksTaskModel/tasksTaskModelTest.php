<?php

require_once(dirname(__FILE__).'/../../tasksTestCase.php');

class tasksTaskModelTest extends tasksTestCase
{
    public function testNumberWhenChangeProject()
    {
        $project_1 = $this->createProject();
        $this->assertNotEmpty($project_1);

        $task_1 = $this->createTask(array(
            'project_id' => $project_1['id']
        ));
        $this->assertNotEmpty($task_1);

        $project_2 = $this->createProject();
        $this->assertNotEmpty($project_2);

        $task_2 = $this->createTask(array(
            'project_id' => $project_2['id']
        ));
        $this->assertNotEmpty($task_2);

        $this->assertEquals($task_1['number'], $task_2['number']);
        $this->assertNotEquals($task_1['project_id'], $task_2['project_id']);

        $tm = new tasksTaskModel();

        $result = $tm->update($task_1['id'], array(
            'project_id' => $project_2['id']
        ));
        $this->assertTrue($result);

        $task_1 = $tm->getById($task_1['id']);
        $task_2 = $tm->getById($task_2['id']);

        $this->assertNotEquals($task_1['number'], $task_2['number']);
        $this->assertEquals($task_1['project_id'], $task_2['project_id']);
    }

    public function testMilestoneWhenChangeProject()
    {
        $milestone = $this->createMilestone();

        $project1 = $this->createProject();
        $project2 = $this->createProject();

        $task = $this->createTask(array(
            'project_id' => $project1['id'],
            'milestone_id' => $milestone['id']
        ));

        $this->assertEquals($project1['id'], $task['project_id']);
        $this->assertEquals($milestone['id'], $task['milestone_id']);

        $tm = new tasksTaskModel();

        $result = $tm->update($task['id'], array(
            'project_id' => $project2['id'],
            'milestone_id' => $milestone['id']
        ));
        $this->assertTrue($result);

        $task = $tm->getById($task['id']);

        $this->assertEquals($project2['id'], $task['project_id']);
        $this->assertEquals($milestone['id'], $task['milestone_id']);
    }

    public function testSaveMilestone()
    {
        $task = $this->createTask(array(
            'milestone_id' => ''
        ));
        $this->assertNull($task['milestone_id']);

        $task = $this->createTask(array(
            'milestone_id' => null
        ));
        $this->assertNull($task['milestone_id']);

        $task = $this->createTask(array(
            'milestone_id' => 0
        ));
        $this->assertEquals(0, $task['milestone_id']);

        $task = $this->createTask(array(
            'milestone_id' => 123
        ));
        $this->assertEquals(123, $task['milestone_id']);

        $tm = new tasksTaskModel();

        $tm->update($task['id'], array(
            'milestone_id' => 124
        ));
        $task = $tm->getById($task['id']);
        $this->assertEquals(124, $task['milestone_id']);

        $tm->update($task['id'], array(
            'milestone_id' => ''
        ));
        $task = $tm->getById($task['id']);
        $this->assertEquals(null, $task['milestone_id']);

        $tm->update($task['id'], array(
            'milestone_id' => 0
        ));
        $task = $tm->getById($task['id']);
        $this->assertEquals(0, $task['milestone_id']);

        $tm->update($task['id'], array(
            'milestone_id' => null
        ));
        $task = $tm->getById($task['id']);
        $this->assertEquals(null, $task['milestone_id']);
    }

}
