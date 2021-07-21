<?php

class tasksExportPlugin extends waPlugin
{
    protected function isAdmin()
    {
        return wa()->getUser()->isAdmin('tasks');
    }

    public function backendTasks()
    {
        if (!$this->isAdmin()) {
            return;
        }

        return [
            'header' => [
                'toolbar' => $this->renderTemplate('common', 'Link.html'),
            ],
        ];
    }

    public function backendAssets()
    {
        if (!$this->isAdmin()) {
            return;
        }
        $version = $this->getVersion();
        wa()->getResponse()->addJs('plugins/export/js/export.js?v=' . $version, 'tasks');
        wa()->getResponse()->addCss('plugins/export/css/style.css?v=' . $version, 'tasks');
    }

    protected function renderTemplate($scope, $template_path, $assign = [], $cache_id = null)
    {
        $view = wa()->getView();
        $old_vars = $view->getVars();

        $view->clearAllAssign();
        $view->assign($assign);

        $full_templates_path = $this->buildFullTemplatePath($scope, $template_path);
        $html = $view->fetch($full_templates_path);

        $view->clearAllAssign();
        $view->assign($old_vars);

        return $html;
    }
}
