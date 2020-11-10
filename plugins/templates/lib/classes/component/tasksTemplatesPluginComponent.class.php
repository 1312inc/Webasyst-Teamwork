<?php

abstract class tasksTemplatesPluginComponent
{
    protected function render($template, $assign = array())
    {
        if (substr($template, 0, 8) !== 'plugins/') {
            $template = $this->getTemplatePath($template);
        }
        if (!file_exists($template)) {
            return '';
        }

        $view = wa()->getView();
        $old_vars = $view->getVars();
        $view->clearAllAssign();
        $view->assign($assign);

        $html = $view->fetch($template);

        $view->clearAllAssign();
        $view->assign($old_vars);

        return $html;
    }

    protected function getTemplatePath($template)
    {
        return wa()->getAppPath("plugins/templates/templates/component/{$template}", 'tasks');
    }
}
