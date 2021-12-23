<?php

/**
 * Shows form to create new or edit existing task.
 */
class tasksTasksEditAction extends waViewAction
{
    public $task;
    public $project;
    public $projects;
    public $milestones;

    public $users;
    public $projects_users;

    public function execute()
    {
        $this->projects = $projects = tsks()->getEntityRepository(tasksProject::class)->getProjectsAsArray();
        if (!$projects) {
            $this->setTemplate(
                wa('tasks')->getAppPath(tsks()->getUI2TemplatePath('templates/actions%s/tasks/NoProjectsError.html'))
            );

            return;
        }

        $this->task = $task = $this->getTask($projects);

        if (empty($projects[$task['project_id']])) {
            $project_model = new tasksProjectModel();
            $this->project = tasksHelper::extendIcon($project_model->getEmptyRow());
        } else {
            $this->project = $projects[$task['project_id']];
        }

        $milestone_model = new tasksMilestoneModel();
        $this->milestones = $milestone_model->getMilestonesWithOrder(false);

        $this->users = (new tasksApiTeamGetTopAssigneesHandler())
            ->getUsers(
                new tasksApiTeamGetTopAssigneesRequest(!empty($this->project['id']) ? (int) $this->project['id'] : null)
            );
        $this->projects_users = $this->getProjectsUsers($projects, $this->users);

        $backend_task_edit = $this->triggerEvent($task);

        $this->view->assign([
            'task' => $task,
            'projects' => $projects,
            'project' => $this->project,
            'projects_users' => $this->projects_users,
            'projects_priority_users' => [], // !!!
            'milestones' => $this->milestones,
            'users' => $this->users,
            'backend_task_edit' => ifempty($backend_task_edit, []),
        ]);

    }

    protected function getProjectsUsers($projects, $users)
    {
        $user_rights_model = new waContactRightsModel();
        $admins = $user_rights_model->getUsers('tasks', 'backend', 2);

        $sql = "SELECT DISTINCT IF(r.group_id < 0, -r.group_id, g.contact_id) user_id, SUBSTR(r.name, 9) project_id
                FROM  wa_contact_rights r
                LEFT JOIN wa_user_groups g ON r.group_id = g.group_id
                WHERE (r.app_id = 'tasks' AND r.name LIKE 'project.%' AND r.value > 0)";
        $rows = $user_rights_model->query($sql)->fetchAll();
        $project_users = [];
        foreach ($rows as $row) {
            $project_users[$row['project_id']][$row['user_id']] = $row['user_id'];
        }

        $result = [];
        foreach ($projects as $p_id => $p) {
            $result[$p_id] = [];
            foreach ($users as $user_id => $u) {
                if (in_array($user_id, $admins) || isset($project_users[$p_id][$user_id])) {
                    $result[$p_id][] = $user_id;
                }
            }
        }

        return $result;
    }

    protected function getTask($projects)
    {
        $n = waRequest::get('n');
        $id = waRequest::get('id', 0, 'int');
        if (!$id && !$n) {
            $task = new tasksTask();
            if (!$projects) {
                throw new waException('No projects', 500);
            } else {
                $p = reset($projects);
                $task['project_id'] = $p['id'];
            }
        } else {
            $task = new tasksTask(ifempty($id, $n));
            if (!$task->exists()) {
                throw new waException(_w('Task not found'), 404);
            }
            if (!$task->canEdit()) {
                throw new waRightsException(_w('Access denied'));
            }
        }

        // Allows to overwrite task data via POST to show in editor
        $task_data = waRequest::post('task', null, 'array');
        if ($task_data) {
            $task->setAll($task_data);
        }

        return $task;
    }

    protected function triggerEvent($task)
    {
        /**
         * @event backend_task_edit
         *
         * @param int|array|tasksTask $task
         *
         * @return array[string]array $return[%plugin_id%] array of html output
         *
         * @return string $return[%plugin_id%]['before_header'] html
         * @return string $return[%plugin_id%]['header'] html
         * @return string $return[%plugin_id%]['after_header'] html
         *
         * @return string $return[%plugin_id%]['before_name'] html
         * @return string $return[%plugin_id%]['name'] html
         * @return string $return[%plugin_id%]['after_name'] html
         *
         * @return string $return[%plugin_id%]['before_description'] html
         * @return string $return[%plugin_id%]['description'] html
         * @return string $return[%plugin_id%]['after_description'] html
         *
         * @return string $return[%plugin_id%]['before_attachments'] html
         * @return string $return[%plugin_id%]['attachments'] html
         * @return string $return[%plugin_id%]['after_attachments'] html
         *
         * @return string $return[%plugin_id%]['before_buttons'] html
         * @return string $return[%plugin_id%]['buttons'] html
         * @return string $return[%plugin_id%]['after_buttons'] html
         *
         * @return string $return[%plugin_id%]['before_fields'] html
         * @return string $return[%plugin_id%]['after_fields'] html
         *
         * @return string $return[%plugin_id%]['more'] html
         *
         */
        $params = [
            'task' => $task,
            'action' => $this,
        ];

        return wa()->event('backend_task_edit', $params);
    }

}

