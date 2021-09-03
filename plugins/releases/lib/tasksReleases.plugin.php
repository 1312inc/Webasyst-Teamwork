<?php

class tasksReleasesPlugin extends waPlugin
{
    public function backendSettingsSidebar()
    {
        $component = new tasksReleasesPluginSettingsComponent();
        return array(
            'top_li' => $component->getSidebarItem()
        );
    }

    public function backendSidebar()
    {
        $component = new tasksReleasesPluginSidebarComponent();
        return array(
            'section' => $component->getSidebarItem()
        );
    }

    public function backendTaskEdit($params)
    {
        $component = new tasksReleasesPluginTaskComponent($params['task']);
        return array(
            'name' => $component->getTypeSelectorHtml(),
            'more' => $component->getEditHtml()
        );
    }

    public function backendTask($params)
    {
        $task = $params['task'];
        $tasks = array(
            $task['id'] => $task
        );
        $blocks = $this->getTasksHtmlBlocks($tasks);
        return isset($blocks[$task['id']]) ? $blocks[$task['id']] : array();
    }

    public function backendTasks($params)
    {
        $result = array(
            'tasks'  => array(),
            'header' => array(),
            'body'   => array()
        );
        $result['tasks'] = $this->getTasksHtmlBlocks($params['tasks']);
        $component = new tasksReleasesPluginFiltersComponent();
        $result['header']['filters'] = $component->getFilterBlocks();
        $result['body']['top'] = $this->getScopeStats($params);
        return $result;
    }

    protected function getTasksHtmlBlocks($tasks)
    {
        $component = new tasksReleasesPluginTasksComponent($tasks);
        $result = array();
        foreach ($component->getFieldsHtml() as $task_id => $html) {
            $result[$task_id]['before_buttons'] = $html;
        }
        foreach ($component->getButtonsHtml() as $task_id => $html) {
            $result[$task_id]['buttons'] = $html;
        }
        foreach ($component->getTypeHtml() as $task_id => $html) {
            $result[$task_id]['header'] = $html;
        }
        return $result;
    }

    protected function getScopeStats($params)
    {
        $hash = $params['hash'];
        if (substr($hash, 0, 6) !== 'scope/') {
            return '';
        }
        $component = new tasksReleasesPluginScopeStatsComponent((int)substr($hash, 6));
        return $component->getStatsBlock();
    }

    public function backendMilestoneEdit($params)
    {
        $component = new tasksReleasesPluginMilestoneComponent($params['milestone']);
        return array(
            'more' => $component->getEditHtml()
        );
    }

    public function taskSave($params)
    {
        $component = new tasksReleasesPluginTaskComponent($params['task']);
        $component->save();
    }

    public function milestoneSave($params)
    {
        $component = new tasksReleasesPluginMilestoneComponent($params['milestone']);
        $component->save();
    }


    public function backendAssets()
    {
        $version = $this->getVersion();
        wa()->getResponse()->addJs('plugins/releases/js/plugin.js?v=' . $version, 'tasks');
        wa()->getResponse()->addJs('plugins/releases/js/taskEdit.js?v=' . $version, 'tasks');
        wa()->getResponse()->addJs('plugins/releases/js/taskTypes.js?v=' . $version, 'tasks');
        wa()->getResponse()->addJs('plugins/releases/js/milestoneEdit.js?v=' . $version, 'tasks');
        wa()->getResponse()->addJs('plugins/releases/js/tasksScopeStats.js?v=' . $version, 'tasks');
        wa()->getResponse()->addJs('plugins/releases/js/taskKanbanSettings.js?v=' . $version, 'tasks');
        wa()->getResponse()->addJs('plugins/releases/js/chart.min.js?v=' . $version, 'tasks');
        wa()->getResponse()->addCss('plugins/releases/css/style.css?v=' . $version, 'tasks');
    }

    public function tasksCollectionSearch($params)
    {
        $component = new tasksReleasesPluginFiltersComponent();
        $component->applyFilters($params['collection'], $params['conditions']);
    }

    /**
     * @event show_status_form
     * @param $params
     * @return array
     * @throws waException
     */
    public function showStatusForm($params)
    {
        $releases_ext_model = new tasksReleasesPluginTaskExtModel();

        $task = $params['task'];
        $status_id = $params['status_id'];
        $task_id = $task->id;
        $return_data = array();

        $show_statuses = $this->getSettings('show_statuses');
        $project_statuses = tasksHelper::getStatuses($task->project_id);
        $ext_task = $releases_ext_model->getByField('task_id', $task_id);
        $ext_task_type = ifset($ext_task, 'type', null);

        if (isset($show_statuses[$status_id]) && isset($project_statuses[$status_id])) {
            $return_data[] = $this->getTimeFactHtml($ext_task);

            if ($ext_task_type === 'sr' || $ext_task_type === 'bug') {
                $return_data[] = $this->getResolutionsHtml($ext_task);
            }

        }

        return $return_data;
    }

    /**
     * @event save_status_form
     * @param $params
     */
    public function saveStatusForm($params)
    {
        $releases_info = ifset($params, 'data', 'task_plugin_releases_task_ext', null);
        $task_id = ifset($params, 'data', 'id', null);

        if ($releases_info && $task_id) {
            $releases_ext_model = new tasksReleasesPluginTaskExtModel();

            $resolution = ifset($releases_info, 'resolution', null);
            $timecosts_fact = ifset($releases_info, 'timecosts_fact', null);
            $data = array();

            if ($resolution) {
                $data['resolution'] = $resolution;
            }

            if ($timecosts_fact) {
                $data['timecosts_fact'] = $timecosts_fact;
            }

            if ($data) {
                $releases_ext_model->updateById($task_id, $data);
            }

            return;
        }


    }

    protected function getTimeFactHtml($ext_task)
    {
        $view = wa()->getView();
        $timecosts_fact = ifset($ext_task, 'timecosts_fact', '');

        $field_names = tasksReleasesPluginTaskExtModel::getFieldNames();

        $view->assign('field_names', $field_names);
        $view->assign('timecosts_fact', $timecosts_fact);

        $form_html = $view->fetch('plugins/releases/templates/actions/statusform/TimeFact.html');

        return $form_html;
    }

    protected function getResolutionsHtml($ext_task)
    {
        $view = wa()->getView();
        $fact_resolution = ifset($ext_task, 'resolution', '');

        $field_names = tasksReleasesPluginTaskExtModel::getFieldNames();
        $resolutions = tasksReleasesPluginTaskExtModel::getResolutions();

        $view->assign('field_names', $field_names);
        $view->assign('resolutions', $resolutions);
        $view->assign('fact_resolution', $fact_resolution);

        $form_html = $view->fetch('plugins/releases/templates/actions/statusform/ResolutionFact.html');

        return $form_html;
    }

    public function kanbanStatusTasks($params)
    {
        $tasks_releases_task_ext_model = new tasksReleasesPluginTaskExtModel();
        $task_ids = [];
        foreach ($params['tasks'] as &$type_tasks) {
            foreach ($type_tasks['tasks'] as $task) {
                $task_ids[] = (int)$task->id;
            }
        }
        $kanban_colors = $tasks_releases_task_ext_model->select('task_id, kanban_color')->where('task_id IN (' . implode(',', $task_ids) . ')')->fetchAll('task_id');

        $data = [];

        foreach ($params['tasks'] as $type_tasks) {
            foreach ($type_tasks['tasks'] as $task) {
                /** @var tasksTask $task **/
                $task_id = $task->id;
                $changed_time = null;
                $date_difference = 0;
                foreach ($task->getLog() as $log) {
                    if ($log['project_id'] == $task->project_id && $log['before_status_id'] != $log['after_status_id']
                        && ($log['before_status_id'] == null || $log['before_status_id'] == $task->status_id
                            || $log['after_status_id'] == $task->status_id)
                    ) {
                        if ($log['after_status_id'] == $task->status_id) {
                            $changed_time = strtotime($log['create_datetime']);
                        } elseif ($changed_time && $log['before_status_id'] == $task->status_id) {
                            $date_difference += strtotime($log['create_datetime']) - $changed_time;
                            $changed_time = null;
                        }
                    }
                }
                if ($changed_time) {
                    $date_difference += time() - $changed_time;
                }
                $days_difference = floor(($date_difference) / 3600 / 24);
                $points = str_repeat('<div class="day-point"></div>', min(10, $days_difference));
                $red_class = $days_difference > 7 ? 'red' : '';
                $task_color = isset($kanban_colors[$task_id]['kanban_color']) ? $kanban_colors[$task_id]['kanban_color'] : '';
                $data[$task_id]['after_body'] = <<<HTML
<span class="t-releases-plugin-task-color-setting" data-kanban-task-color="{$task_color}">
    <a href="javascript:void(0);" class="t-control-link button light-gray smallest rounded t-return-link kanban-task-link" title="Открыть настройки" data-kanban-task-id="{$task_id}">
        <i class="fas fa-cog"></i>
    </a>
    <script>
        (function () {
            var kanban_task_color = new KanbanTaskColor($task_id);
            kanban_task_color.setColor();
        })(jQuery);
    </script>
</span>
<div class="days-points flexbox space-8 custom-p-4 $red_class" title="Количество дней после изменения статуса: $days_difference">
    $points
</div>
HTML;
            }
        }

        return $data;
    }

    public function kanbanPage($params)
    {
        $request = waRequest::get();
        $milestone_id = ifset($request, 'milestone_id', null);
        $data = [
            'header' => [
                'filters' => ''
            ]
        ];

        if (isset($milestone_id) && count($request) === 2 && isset($request['module'])) {
            $tasks_releases_milestone_ext_model = new tasksReleasesPluginMilestoneExtModel();
            $limits = json_encode($tasks_releases_milestone_ext_model->where('milestone_id =' . (int)$milestone_id)->fetchAll('status_id'));
            $script = <<<SCRIPT
<script>
    (function () {
        var kanban_task_settings = new KanbanTaskSettings($limits);
        kanban_task_settings.init();
    })(jQuery);
</script>
SCRIPT;

            $data['header']['filters'] .= $script;
        }

        $hide_new_and_completed_tasks = (bool)wa()->getUser()->getSettings('tasks', 'hide_new_and_completed_tasks', false);
        $checked = $hide_new_and_completed_tasks ? 'checked' : '';
        $selector = <<<SELECTOR
<div class="t-checkbox-column" id="js-hide-new-and-completed-tasks">
    <label>
        <span class="wa-checkbox">
            <input type="checkbox" name="hide_new_and_completed_tasks" value="1" $checked/>
            <span>
                <span class="icon">
                    <i class="fas fa-check"></i>
                </span>
            </span>
        </span>
        <span class="custom-ml-4">Спрятать Новые и Завершённые</span>
    </label>
</div>
<script>
    (function () {
        var kanban_task_settings_hide_new_and_completed = new KanbanTaskSettingHideNewAndCompleted($hide_new_and_completed_tasks);
        kanban_task_settings_hide_new_and_completed.init();
    })(jQuery);
</script>
SELECTOR;

        $data['header']['filters'] .= $selector;

        return $data;
    }
}
