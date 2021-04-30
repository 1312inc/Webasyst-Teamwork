<?php
require_once(realpath(dirname(__FILE__).'/../../../../').'/init.php');

/**
 * Class tasksGitMethodTest
 * @requires extension skip
 * @group long_tests
 */
class tasksGitMethodTest extends PHPUnit_Framework_TestCase
{
    protected $table = array('tasks_task', 'tasks_task_log', 'tasks_project', 'wa_contact', 'tasks_task_log_params', 'wa_contact_emails');

    public function setUp()
    {
        wa('tasks', 1);
        waTestEnvironment::getInstance()->setUpEmptyTemporaryTables($this->table);
    }

    public function testExecute_EmptyRef_returnEmptyString()
    {
        //Model
        $m = new fakeTasksGitMethod();

        //Set data
        $data = $this->getCommitsData();
        $data['ref'] = null;
        $m->data = $data;

        //Get assert data
        $result = $m->execute();

        //Assert
        $this->assertEquals('', $result);
    }

    public function testHandlePush_EmptyCommits_logEmpty()
    {
        //Model
        $git_method = new fakeTasksGitMethod();
        $log_model = new tasksTaskLogModel();


        //Set data
        $data = $this->getCommitsData();
        $data['commits'] = null;
        $git_method->data = $data;

        //Get assert data
        $git_method->execute();
        $logs = $log_model->getAll();

        //Assert
        $this->assertEquals(array(), $logs);
    }

    public function testHandlePush_EmptyCommitsMessage_logEmpty()
    {
        //Model
        $git_method = new fakeTasksGitMethod();
        $log_model = new tasksTaskLogModel();

        //Set data
        $this->setTestTasks();
        $data = $this->getCommitsData();
        $data['commits'][0]['message'] = null;
        $data['commits'][1]['message'] = null;

        $git_method->data = $data;

        //Get assert data
        $git_method->execute();
        $logs = $log_model->getAll();

        //Assert
        $this->assertEquals(array(), $logs);
    }

    public function testHandlePush_ValidCommitsMessage_logEmpty()
    {
        //Model
        $git_method = new fakeTasksGitMethod();
        $log_model = new tasksTaskLogModel();

        //Set data
        $this->setTestTasks();
        $data = $this->getCommitsData();
        $data['commits'][1]['message'] = null;
        $git_method->data = $data;

        //Get assert data
        $git_method->execute();
        $logs = $log_model->getAll();

        //Assert
        $this->assertEquals(1, count($logs));
    }

    public function testHandlePush_createNewTask_issetTask()
    {
        //Model
        $git_method = new fakeTasksGitMethod();
        $log_model = new tasksTaskLogModel();
        $task_model = new tasksTaskModel();

        //Set data
        $data = $this->getCommitsData();
        $data['commits'][0]['message'] = null;
        $git_method->data = $data;
        $this->setTestProject();

        //Get assert data
        $git_method->execute();
        $logs = $log_model->getAll();
        $tasks = $task_model->getAll();

        //Assert
        $this->assertEquals(1, count($logs));
        $this->assertEquals(1, count($tasks));
        $this->assertEquals('', $tasks[0]['name']);
    }

    public function testHandlePush_invalidTaskNumber_emptyLog()
    {
        //Model
        $git_method = new fakeTasksGitMethod();
        $log_model = new tasksTaskLogModel();

        //Set data
        $this->setTestTasks();
        $data = $this->getCommitsData();
        $data['commits'][0]['message'] = '#1.111';
        $data['commits'][1]['message'] = null;
        $git_method->data = $data;

        //Get assert data
        $git_method->execute();
        $logs = $log_model->getAll();

        //Assert
        $this->assertEquals(array(), $logs);
    }

    public function testHandlePush_incorrectTaskNumber_emptyLog()
    {
        //Model
        $git_method = new fakeTasksGitMethod();
        $log_model = new tasksTaskLogModel();

        //Set data
        $this->setTestTasks();
        $data = $this->getCommitsData();
        $data['commits'][0]['message'] = '#1$488';
        $data['commits'][1]['message'] = null;
        $git_method->data = $data;

        //Get assert data
        $git_method->execute();
        $logs = $log_model->getAll();

        //Assert
        $this->assertEquals(array(), $logs);
    }

    public function testParseCommit_emptyContact_addHeaderToText()
    {
        //Model
        $git_method = new fakeTasksGitMethod();

        //Set data
        $commits_data = $this->getCommitsData();
        $commit = $commits_data['commits'][1];

        //Get assert data
        $result = $git_method->fakeParseCommit($commit);

        //Assert
        $this->assertEquals(9, strpos($result['text'], 'fake user'));
    }

    public function testParseCommit_issetContact_textNoChange()
    {
        //Model
        $git_method = new fakeTasksGitMethod();

        //Set data
        $commits_data = $this->getCommitsData();
        $commit = $commits_data['commits'][0];
        $this->createContact();

        //Get assert data
        $result = $git_method->fakeParseCommit($commit);

        //Assert
        $this->assertFalse(strpos($result['text'], 'real user'));
    }

    protected function getCommitsData()
    {
        $data = array(
            'object_kind'         => 'push',
            'before'              => 'b1432a9e92d29c3d8b0c01decfa10ef294d8b627',
            'after'               => '738e3e65d3979e4ee5f8a1e0a8ae550209424b41',
            'ref'                 => 'refs/heads/dev',
            'checkout_sha'        => '738e3e65d3979e4ee5f8a1e0a8ae550209424b41',
            'message'             => null,
            'user_id'             => 1,
            'user_name'           => 'Test User',
            'user_email'          => 'testUser@webasyst.net',
            'project_id'          => 1,
            'repository'          => array(
                'name'             => 'framework',
                'url'              => 'git@git.webasyst.com:webasyst/framework.git',
                'description'      => '',
                'homepage'         => 'https://git.webasyst.com/webasyst/framework',
                'git_http_url'     => 'https://git.webasyst.com/webasyst/framework.git',
                'git_ssh_url'      => 'git@git.webasyst.com:webasyst/framework.git',
                'visibility_level' => 0,
            ),
            'commits'             => array(
                0 => array(
                    'id'        => '91ea20b12d111fec3653e06d6356bb570e320db4',
                    'message'   => 'test message #1.1',
                    'timestamp' => '2018-06-05T11:34:30+03:00',
                    'url'       => 'https://git.webasyst.com/webasyst/framework/commit/91ea20b12d111fec3653e06d6356bb570e320db4',
                    'author'    => array(
                        'name'  => 'real user',
                        'email' => 'realuser@webasyst.com',
                    ),
                    'added'     => array(),
                    'modified'  => array(
                        0 => 'wa-apps/tasks/templates/actions/tasks/Task.html',
                    ),
                    'removed'   => array(),
                ),
                1 => array(
                    'id'        => '738e3e65d3979e4ee5f8a1e0a8ae550209424b41',
                    'message'   => 'test message #1.new',
                    'timestamp' => '2018-06-05T11:34:45+03:00',
                    'url'       => 'https://git.webasyst.com/webasyst/framework/commit/738e3e65d3979e4ee5f8a1e0a8ae550209424b41',
                    'author'    => array(
                        'name'  => 'fake user',
                        'email' => 'fakeuser@webasyst.com',
                    ),
                    'added'     => array(),
                    'modified'  => array(
                        0 => 'wa-apps/tasks/templates/actions/tasks/Task.html',
                    ),
                    'removed'   => array(),
                ),
            ),
            'total_commits_count' => 2,
        );

        return $data;
    }

    protected function setTestTasks()
    {
        $task_model = new tasksTaskModel();

        $tasks = array(
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
                'milestone_id'        => '1',
            ),
        );

        $result = $task_model->multipleInsert($tasks);
        return $result;
    }

    protected function setTestProject()
    {
        $project_model = new tasksProjectModel();

        $data = array(
            array(
                'id' => 1,
                'name'       => 'Test',
                'contact_id' => 1,
                'create_datetime' => date('Y-m-d H:i:s'),
                'tasks_number' => 0,
            )
        );
        $project_model->multipleInsert($data);
    }

    protected function createContact($data = array())
    {
        $contact_model = new waContactModel();
        $contact_email_mode = new waContactEmailsModel();

        $contact = $contact_model->insert(array('name' => 'realUser', 'is_user' => '1', 'login' => 'test', 'password' => '123123'));
        $contact_email_mode->insert(array('contact_id' => $contact, 'email' => 'realuser@webasyst.com', 'status' => 'confirmed'));

    }

    public function tearDown()
    {
        waTestEnvironment::getInstance()->deleteTemporaryTables($this->table);
    }
}

wa('tasks', 1);

class fakeTasksGitMethod extends tasksGitMethod
{
    public $data;

    public function parseData()
    {

    }

    public function fakeParseCommit($commit)
    {
        return $this->parseCommit($commit);
    }
}

