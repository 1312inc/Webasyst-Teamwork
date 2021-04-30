<?php

//require_once(realpath(dirname(__FILE__).'/../../').'/init.php');

abstract class tasksTestCase extends PHPUnit_Framework_TestCase
{
    static protected $resources = array();

    static protected $data_path;

    public static function setUpBeforeClass()
    {
        wa('tasks');
        $contact = new waUser();
        $contact['name'] = __CLASS__ . 'Contact' . rand();
        $contact['email'] = uniqid(str_replace('::', '_',__CLASS__)) . '@ut.org';
        $phone = '';
        for ($i = 0; $i < 11; $i += 1) {
            $phone .= rand(0, 9);
        }
        $contact['phone'] = $phone;
        $contact->save();
        $contact = new waUser($contact->getId());
        self::addResource('contact', $contact);
        wa()->setUser($contact);
        self::$data_path = realpath(dirname(__FILE__) . '/data/');
    }

    public function tearDown()
    {
        $refl = new ReflectionProperty('tasksHelper', 'static_cache');
        $refl->setAccessible(true);
        $refl->setValue(array());
    }

    public function createContact($data = array())
    {
        $contact = new waContact();
        $contact['name'] = __CLASS__ . 'Contact' . rand();
        $contact->save($data);
        if (isset($data['photo_path'])) {
            $contact->setPhoto($data['photo_path']);
        }
        self::addResource('contact', $contact);
        return $contact;
    }

    public function createUser($data = array())
    {
        $data['name'] = __CLASS__ . 'ContactUser' . rand();
        $contact = $this->createContact($data);
        $cm = new waContactModel();
        $cm->updateById($contact->getId(), array(
            'is_user' => 1
        ));
        return new waContact($contact->getId());
    }


    public function createProject()
    {
        $user = $this->getUser();
        $pm = new tasksProjectModel();
        $id = $pm->add(array(
            'name' => uniqid('UnitTestProject', true),
            'contact_id' => $user->getId(),
            'icon' => 'blog',
            'color' => 't-white'
        ));
        self::addResource('project', $id);
        return $pm->getById($id);
    }

    public function createTask($data = array())
    {
        $user = $this->getUser();
        $tm = new tasksTaskModel();
        $data = array_merge(array(
            'name' => uniqid('UnitTestTask', true),
            'text' => uniqid('UnitTestTaskText', true),
            'create_contact_id' => $user->getId(),
            'assigned_contact_id' => $user->getId()
        ), $data);

        if (empty($data['project_id'])) {
            $project = $this->createProject();
            $data['project_id'] = $project['id'];
        }

        $task = $tm->add($data);
        self::addResource('task', $task);
        return $task;
    }

    public function createMilestone($data = array())
    {
        $data = array_merge(array(
            'name' => uniqid('UnitTestMilestone', true),
            'description' => uniqid('UnitTestMilestoneDescription', true)
        ), $data);

        if (empty($data['project_id'])) {
            $project = $this->createProject();
            $data['project_id'] = $project['id'];
        }

        $mm = new tasksMilestoneModel();
        $id = $mm->insert($data);
        self::addResource('milestone', $id);
        return $mm->getById($id);
    }

    /**
     * @return waUser
     */
    protected function getUser()
    {
        return wa()->getUser();
    }

    public static function addResource($resource_name, $resource)
    {
        self::addResources($resource_name, array($resource));
    }

    public static function addResources($resource_name, $resources)
    {
        self::$resources[$resource_name] = (array)ifset(self::$resources[$resource_name]);
        foreach ($resources as $resource) {
            self::$resources[$resource_name][] = $resource;
        }
    }

    /**
     * @param string $resource_name
     * @return mixed
     */
    protected function getResource($resource_name)
    {
        return isset(self::$resources[$resource_name]) ? self::$resources[$resource_name] : null;
    }

    public static function tearDownAfterClass()
    {
        self::clearTasks();
        self::clearProjects();
        self::clearContacts();
        self::clearTags();
        self::clearMilestones();
    }

    protected static function getIdsFromItems($items)
    {
        $ids = array();
        $items = (array) $items;
        foreach ($items as $item) {
            if (is_scalar($item)) {
                $ids[] = $item;
            } elseif (is_array($item) && isset($item['id'])) {
                $ids[] = $item['id'];
            } elseif (is_object($item) && method_exists($item, 'getId')) {
                $ids[] = $item->getId();
            } elseif (is_object($item) && isset($item['id'])) {
                $ids[] = $item['id'];
            }
        }
        return array_unique($ids);
    }

    protected static function receiveResources($keys, $unset = true)
    {
        $resources = array();
        foreach ((array)$keys as $key) {
            foreach ((array)ifset(self::$resources[$key]) as $resource) {
                $resources[] = $resource;
                if ($unset) {
                    unset(self::$resources[$key]);
                }
            }
        }
        return $resources;
    }

    protected static function clearContacts()
    {
        $contacts = self::receiveResources(array('contact', 'contacts'));
        $contact_ids = self::getIdsFromItems($contacts);
        $cm = new waContactModel();
        $cm->delete($contact_ids, false);
    }

    protected static function clearProjects()
    {
        $projects = self::receiveResources(array('project', 'projects'));
        $project_ids = self::getIdsFromItems($projects);
        $pm = new tasksProjectModel();
        $pm->deleteById($project_ids);
    }

    protected static function clearTasks()
    {
        $tasks = self::receiveResources(array('task', 'tasks'));
        $task_ids = self::getIdsFromItems($tasks);
        $tm = new tasksTaskModel();
        $tm->delete($task_ids);
    }

    protected static function clearTags()
    {
        $tags = self::receiveResources(array('tag', 'tags'));
        $tag_ids = array();
        $tag_names = array();
        foreach ($tags as $tag) {
            if (wa_is_int($tag)) {
                $tag_ids[] = $tag;
            } else {
                $tag_names[] = $tag;
            }
        }

        $tm = new tasksTagModel();
        $ttm = new tasksTaskTagsModel();

        if ($tag_names) {
            $ids = $tm->select('id')->where('name IN(:names)', array('names' => $tag_names))->fetchAll(null, true);
            $tag_ids = array_merge($tag_ids, $ids);
            $tag_ids = array_unique($tag_ids);
        }

        if ($tag_ids) {
            $tm->deleteById($tag_ids);
            $ttm->deleteByField(array('tag_id' => $tag_ids));
        }
    }

    protected static function clearMilestones()
    {
        $milestones = self::receiveResources(array('milestone', 'milestones'));
        $milestone_ids = self::getIdsFromItems($milestones);
        $mm = new tasksMilestoneModel();
        $mm->deleteById($milestone_ids);
    }

}
