<?php

class tasksPreviewPlugin extends waPlugin
{
    public function backendTaskEdit($params)
    {
        $task = $params['task'];
        //$img = $this->getPluginStaticUrl() . 'img/preview-mode.png';

        $template = wa()->getAppPath("plugins/preview/templates/Link.html", 'tasks');
        return array(
            'header' => $this->renderTemplate($template, array(
                'task' => $task
            ))
        );
    }

    public function backendAssets()
    {
        $version = $this->getVersion();
        wa()->getResponse()->addCss('plugins/preview/css/style.css?v=' . $version, 'tasks');
        wa()->getResponse()->addJs('plugins/preview/js/preview.js?v=' . $version, 'tasks');
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
