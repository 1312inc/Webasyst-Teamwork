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
        $template = wa()->getAppPath("plugins/export/templates/Link.html", 'tasks');
        return array(
            'header' => array(
                'toolbar' => $this->renderTemplate($template)
            )
        );
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

    protected function renderTemplate($template, $assign = array())
    {
        $view = wa()->getView();
        $old_vars = $view->getVars();
        $view->clearAllAssign();
        $view->assign($assign);
        $html = $view->fetch($template);
        $view->clearAllAssign();
        $view->assign($old_vars);
        return $html;
    }
}
