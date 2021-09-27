<?php

class tasksGitMethod extends waAPIMethod
{
    protected $method = 'POST';

    protected $data;

    public function parseData()
    {
        /**
         * @link https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/web_hooks/web_hooks.md
         *  We used old json format and he difference from format  this document
         */
        $input = file_get_contents("php://input");

        $this->data = json_decode($input, true);

        if (waRequest::server('HTTP_X_GITHUB_EVENT') === 'push') {
            $this->data['object_kind'] = 'push';
        }

        if (waSystemConfig::isDebug()) {
            waLog::dump(waRequest::server(), 'tasks.git.log');
            waLog::dump($input, 'tasks.git.log');
            waLog::dump($this->data, 'tasks.git.log');
            waLog::dump($_REQUEST, 'tasks.git.log');
        }
    }

    public function execute()
    {
        $this->parseData();

        if (!isset($this->data['ref'])) { // ignore empty ref
            return '';
        }

        $tmp = explode('/', $this->data['ref']);
        $this->data['branch'] = end($tmp);
        switch ($this->data['object_kind']) {
            case 'push':
                if (!in_array($this->data['branch'], ['master', 'main'])) {
                    $this->handlePush($this->data['commits']);
                }
                break;
        }
    }

    public function handlePush($commits)
    {
        if (empty($commits)) {
            return null;
        }

        // #100.500 is task 500 at project 100
        // 100.500: is task 500 at project 100
        $patterns = [
            '~(?:\#(\d+?)\.(\d+|new))~uis',
            '~(?:(\d+)\.(\d+|new):.*)~uisU',
        ];

        wa('webasyst');
        $log_model = new waLogModel();
        $task_model = new tasksTaskModel();
        $task_log_params_model = new tasksTaskLogParamsModel();

        $commit_hashes = [];
        foreach ($commits as $c) {
            $log = $this->parseCommit($c);
            if (!empty($log['params']['git.id'])) {
                $commit_hashes[] = $log['params']['git.id'];
            }
        }

        waLog::log('$commit_hashes', 'tasks.git.debug.log');
        waLog::dump($commit_hashes, 'tasks.git.debug.log');

        $know_commits = $task_log_params_model->getByField(['name' => 'git.id', 'value' => $commit_hashes], 'value');

        waLog::log('$know_commits', 'tasks.git.debug.log');
        waLog::dump($know_commits, 'tasks.git.debug.log');

        foreach ($commits as $c) {
            foreach ($patterns as $pattern) {
                if (!preg_match_all($pattern, $c['message'], $matches, PREG_SET_ORDER)) {
                    waLog::log('no match with ' . $pattern, 'tasks.git.debug.log');

                    continue;
                }

                foreach ($matches as $match) {
                    waLog::log('process match ' . $match, 'tasks.git.debug.log');

                    $log = $this->parseCommit($c);

                    waLog::log('parseCommit', 'tasks.git.debug.log');
                    waLog::dump($log, 'tasks.git.debug.log');

                    // Ignore commits that were already in the log (possibly in another branch)
                    $commit_hash = ifempty($log, 'params', 'git.id', null);
                    if (!empty($commit_hash) && !empty($know_commits[$commit_hash])) {
                        waLog::log('Ignore commits that were already in the log (possibly in another branch)', 'tasks.git.log');
                        waLog::dump($know_commits[$commit_hash], 'tasks.git.log');

                        continue 3;
                    }

                    $task = null;
                    [$_, $project_id, $number] = $match;
                    try {
                        if ($number === 'new') {
                            $task = $task_model->add([
                                'name' => '',
                                'project_id' => $project_id,
                                'create_contact_id' => $log['contact_id'],
                                'assigned_contact_id' => $log['contact_id'],
                                'text' => $c['message'],
                            ]);
                            $log_model->add('task_add', $task['id'], null, $log['contact_id']);

                            waLog::log('new task', 'tasks.git.debug.log');
                        } else {
                            $task = $task_model->getByField(compact('project_id', 'number'));

                            waLog::log('old task', 'tasks.git.debug.log');
                            waLog::dump($task, 'tasks.git.debug.log');
                        }
                    } catch (waException $e) {
                        //echo((string)$e);
                        waLog::log($e->getMessage(), 'tasks.git.error.log');
                        waLog::log($e->getTraceAsString(), 'tasks.git.error.log');
                    }

                    if ($task) {
                        waLog::log('add log', 'tasks.git.debug.log');

                        // add log, but not send notification
                        $log = tasksHelper::addLog($task, $log, false);
                        $log_model->add(
                            'task_action',
                            $log['task_id'] . ':' . $log['id'],
                            null,
                            $log['contact_id']
                        );
                    }
                }

                break; // only first matched pattern
            }
        }
    }

    protected function parseCommit($commit)
    {
        // Find contact by email
        // Set 0 contact because null contact well be replaced to current active user
        $contact_id = 0;
        $collection = new waContactsCollection(sprintf('/search/is_user=1&email=%s/', $commit['author']['email']));
        $contacts = $collection->getContacts('id', 0, 2);
        if (count($contacts) === 1) {
            $contact = reset($contacts);
            $contact_id = $contact['id'];
        }

        // Quote commit text into log
        $text = $commit['message'];
        $text = str_replace(['@done', '@closed'], [' @done', ' @closed'], $text);

        //If contact not found, set name and email from commit
        if ($contact_id === 0) {
            $text = _w('Author') . ': ' . $commit['author']['name'] . "\n" .
                _w('Email') . ': ' . $commit['author']['email'] . "\n"
                . $text;
        }

        $text = '>' . str_replace("\n", "\n>", $text);

        return [
            'text' => $text,
            'action' => 'git.commit',
            'contact_id' => $contact_id,
            'params' => [
                'git.id' => $commit['id'] ?? null,
                'git.branch' => $this->data['branch'] ?? '_NO_BRANCH_',
                'git.homepage' => $this->data['repository']['homepage'] ?? ($this->data['repository']['url'] ?? '_NO_REPOSITORY_HOMEPAGE_'),
            ],
        ];
    }
}
