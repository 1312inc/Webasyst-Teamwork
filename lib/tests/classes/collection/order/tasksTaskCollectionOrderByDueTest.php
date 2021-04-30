<?php

require_once(dirname(__FILE__) . '/../../../tasksTestCase.php');

class tasksTaskCollectionOrderByDueTest extends tasksTestCase
{
    public function testOrder()
    {
        $tasks = $this->getOrderedTasks();

        $correct_order = waUtils::getFieldValues($tasks, 'id');

        // arrays must be diffs by its order
        $ids = waUtils::getFieldValues($tasks, 'id');
        while ($correct_order === $ids) {
            shuffle($ids);
        }

        $hash = 'id/' . join(',', $ids);

        $collection = new tasksCollection($hash, array(
            'check_rights' => false
        ));
        $collection->orderBy('id', 'DESC');
        $tasks = $collection->getTasks('id', 0, count($ids));

        // Some arrays, but orders diffs
        $this->assertNotEquals($correct_order, array_keys($tasks));
        $this->assertEquals(count($correct_order), count($tasks));

        $collection = new tasksCollection($hash, array(
            'check_rights' => false
        ));
        $collection->orderByDue();
        $tasks = $collection->getTasks('*', 0, count($ids));

        // Some arrays, and orders equals
        $this->assertEquals($correct_order, array_keys($tasks));
    }

    protected function getOrderedTasks()
    {
        // META ITEMS - LIST OF PAIRS <due_date, milestone_due_date>
        // ORDER MATTERS, DON'T CHANGE IT
        $meta = array(
            array('-10 day'),
            array(null, '-5 day'),
            array('-2 day', '-5 day'),
            array('-1 day'),
            array('0 day'),
            array('+1 day'),
            array('+2 day', '+5 day'),
            array(null, '+5 day'),
            array('+10 day'),
            array(null),
            array(null)
        );

        // unwrap META ITEMS to tasks
        $tasks = array();
        foreach ($meta as $item) {
            $item[0] = ifset($item[0]);
            $item[1] = ifset($item[1]);

            $milestone = null;
            if ($item[1]) {
                $milestone = $this->createMilestone(array('due_date' => date('Y-m-d', strtotime($item[1]))));
            }

            $tasks[] = $this->createTask(array(
                'due_date' => $item[0] ? date('Y-m-d', strtotime($item[0])) : null,
                'milestone_id' => $milestone ? $milestone['id'] : null
            ));
        }

        return $tasks;

    }

}
