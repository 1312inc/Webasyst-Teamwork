<?php
/**
 * Settings / Automation
 */
class tasksAutomationActions extends waActions
{
    protected function defaultAction()
    {
        $offset = waRequest::get('offset', 0, waRequest::TYPE_INT);
        $limit = 500; //tasksOptions::getTasksPerPage();

        $collection = new tasksCollection('repeating');
        $collection->orderByDue();

        $tasks = array_map(function($t) {
            return new tasksTask($t);
        }, $collection->getTasks(
            tasksCollection::FIELDS_TO_GET,
            $offset,
            $limit,
            $total_count
        ));

        $this->display([
            'sidebar_html'     => (new tasksSettingsSidebarAction())->display(),
            'total_count' => $total_count,
            'tasks' => $tasks,
            'cron_job_command' => 'php cli.php tasks worker',
        ], 'templates/actions/automation/Automation.html');
    }
}
