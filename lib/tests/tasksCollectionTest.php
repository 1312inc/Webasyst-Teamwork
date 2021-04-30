<?php

require_once(realpath(dirname(__FILE__).'/../../').'/init.php');
require_once(dirname(__FILE__) . '/tasksTestCase.php');

class tasksCollectionTest extends tasksTestCase
{
    /**
     * @var tasksTaskModel
     */
    protected $m;
    /**
     * @var tasksTaskTagsModel
     */
    protected $tm;
    protected $c1;
    protected $c2;
    protected $project1;
    protected $project2;
    protected $tag1;
    protected $tag2;
    protected $task1;
    protected $task2;

    public function setUp()
    {
        wa('tasks');

        $this->m = new tasksTaskModel();
        $this->tm = new tasksTaskTagsModel();

        $this->c1 = $this->createUser();
        $this->c2 = $this->createUser();

        $this->project1 = $this->createProject();
        $this->project2 = $this->createProject();

        $tm = new tasksTagModel();
        $tag_ids = $tm->addGet(array(
            'UnitTest1',
            'UnitTest2'
        ));
        self::addResources('tags', $tag_ids);

        $tm->updateById($tag_ids[0], array('favorite' => 1));
        $this->tag1 = $tm->getById($tag_ids[0]);

        $tm->updateById($tag_ids[1], array('favorite' => 0));
        $this->tag2 = $tm->getById($tag_ids[1]);

        $this->task1 = $this->createTask(array(
            'text' => 'Test 123 6543',
            'contact_id' => $this->c1['id'],
            'assigned_contact_id' => $this->c2['id'],
            'project_id' => $this->project1['id'],
            'status_id' => -1,
        ));
        $this->task2 = $this->createTask(array(
            'text' => 'Test 987 4567',
            'contact_id' => $this->c2['id'],
            'assigned_contact_id' => $this->c1['id'],
            'project_id' => $this->project2['id'],
            'status_id' => 0,
        ));

        // Task tags
        $this->tm->insert(array(
            'task_id' => $this->task1['id'],
            'tag_id' => $this->tag1['id'],
        ));
        $this->tm->insert(array(
            'task_id' => $this->task2['id'],
            'tag_id' => $this->tag1['id'],
        ));
        $this->tm->insert(array(
            'task_id' => $this->task2['id'],
            'tag_id' => $this->tag2['id'],
        ));
    }

    public function testNoGlobals()
    {
        $this->assertTrue(class_exists('tasksCollection'));
        $classes = waAutoload::getInstance()->getClasses();
        $source = file_get_contents(wa()->getConfig()->getRootPath().'/'.$classes['tasksCollection']);
        $this->assertNotRegExp('~waRequest::~', $source, 'Collection class must not use global state!');
    }

    public function testFields()
    {
        $c = new tasksCollection('id/'.$this->task1['id'], array(
            'check_rights' => false
        ));
        $tasks = $c->getTasks('*');
        $task = reset($tasks);
        $this->assertFalse(!$task, 'id/'.$this->task1['id'].' hash returned nothing');
        $this->assertEmpty(array_diff_key($this->m->getMetadata(), $task), '* did not return all fields');

        $basic_fields = array_fill_keys(array_keys($this->m->getMetadata()), 0);
        $additional_fields = array(
            'status' => 1,
            'favorite_tags' => 1,
            'attachments' => 0,
            'favorite' => 0,
            'contact' => 1,
            'create_contact' => 1,
            'assigned_contact' => 1,
            'project' => 1,
            'tags' => 1,
            'log' => 0,
        );

        foreach($basic_fields + $additional_fields as $field => $nonempty) {
            $tasks = $c->getTasks('id,'.$field);
            $task = reset($tasks);
            $this->arrayHasKey('id', $task, 'Field id is absent');
            $this->arrayHasKey($field, $task, 'Field '.$field.' is absent');
            $nonempty && $this->assertFalse(empty($task[$field]), 'Field '.$field.' is empty');
        }
    }

    public function testSearch()
    {
        $cases = array(
            'search/6543' => $this->task1['id'],
            'search/987' => $this->task2['id'],
            'search/query=123' => $this->task1['id'],
            'search/query=4567' => $this->task2['id'],
            'search/number='.$this->task2['number'] => $this->task2['id'],
        );

        foreach($cases as $hash => $task_id) {
            $this->assertFound($task_id, $hash);
        }
    }

    public function testTag()
    {
        $cases = array(
            'tag/'.$this->tag1['name'] => $this->task1['id'],
            'tag/'.$this->tag1['name'] => $this->task2['id'],
            'tag/'.$this->tag2['name'] => $this->task2['id'],
            'tag/'.$this->tag1['name'].','.$this->tag2['name'] => $this->task1['id'],
            'tag/'.$this->tag2['name'].','.$this->tag1['name'] => $this->task2['id'],
            'tag/'.$this->tag2['name'].','.$this->tag1['name'].'/all' => $this->task2['id'],
        );
        foreach($cases as $hash => $task_id) {
            $this->assertFound($task_id, $hash);
        }

        $cases = array(
            'search/tag='.$this->tag1['name'] => $this->task1['id'],
            'search/tag='.$this->tag1['name'] => $this->task2['id'],
            'search/tag='.$this->tag2['name'] => $this->task2['id'],
            'search/tag='.$this->tag1['name'].','.$this->tag2['name'] => $this->task1['id'],
            'search/tag='.$this->tag2['name'].','.$this->tag1['name'] => $this->task2['id'],
            'search/tag='.$this->tag2['name'].'&tag='.$this->tag1['name'] => $this->task2['id'],
        );
        foreach($cases as $hash => $task_id) {
            $this->assertFound($task_id, $hash);
        }

        $cases = array(
            'tag/'.$this->tag2['name'] => $this->task1['id'],
            'tag/'.$this->tag2['name'].','.$this->tag1['name'].'/all' => $this->task1['id'],
            'tag/zzz'.$this->tag1['name'] => $this->task1['id'],
            'tag/zzz'.$this->tag2['name'].','.$this->tag1['name'].'/all' => $this->task1['id'],
        );
        foreach($cases as $hash => $task_id) {
            $this->assertNotFound($task_id, $hash);
        }

        $cases = array(
            'search/tag='.$this->tag2['name'] => $this->task1['id'],
            'search/tag='.$this->tag2['name'].'&tag='.$this->tag1['name'] => $this->task1['id'],
            'search/tag=zzz'.$this->tag1['name'] => $this->task1['id'],
            'search/tag=zzz'.$this->tag2['name'].'&tag='.$this->tag1['name'] => $this->task1['id'],
        );
        foreach($cases as $hash => $task_id) {
            $this->assertNotFound($task_id, $hash);
        }
    }

    public function testMisc()
    {
        $this->assertFound($this->task1['id'], 'contact/'.$this->task1['contact_id']);
        $this->assertFound($this->task1['id'], 'creator/'.$this->task1['create_contact_id']);
        $this->assertFound($this->task1['id'], 'assigned/'.$this->task1['assigned_contact_id']);
        $this->assertFound($this->task1['id'], 'project/'.$this->task1['project_id']);
        $this->assertFound($this->task1['id'], 'status/'.$this->task1['status_id']);

        $this->assertNotFound($this->task2['id'], 'contact/'.$this->task1['contact_id']);
        $this->assertNotFound($this->task2['id'], 'creator/'.$this->task1['create_contact_id']);
        $this->assertNotFound($this->task2['id'], 'assigned/'.$this->task1['assigned_contact_id']);
        $this->assertNotFound($this->task2['id'], 'project/'.$this->task1['project_id']);
        $this->assertNotFound($this->task2['id'], 'status/'.$this->task1['status_id']);
    }

    protected function assertNotFound($task_id, $hash)
    {
        $c = new tasksCollection($hash);
        $c->orderBy('id', 'DESC');
        foreach($c->getTasks('id') as $task) {
            if ($task['id'] == $task_id) {
                $this->assertTrue(false, "hash={$hash} found a task that it shouldn't have");
            }
        }
    }

    protected function assertFound($task_id, $hash)
    {
        $c = new tasksCollection($hash, array(
            'check_rights' => false
        ));
        $c->orderBy('id', 'DESC');
        foreach($c->getTasks('id') as $task) {
            if ($task['id'] == $task_id) {
                return;
            }
        }
        $this->assertTrue(false, "hash={$hash} did not find a task");
    }
}
