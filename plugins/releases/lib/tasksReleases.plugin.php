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

}
