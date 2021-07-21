<?php

class tasksPreviewPlugin extends waPlugin
{
    public function backendTaskEdit($params)
    {
        $task = $params['task'];

        //$img = $this->getPluginStaticUrl() . 'img/preview-mode.png';

        return [
            'header' => $this->renderTemplate('common', 'Link.html', ['task' => $task]),
        ];
    }

    public function backendAssets()
    {
        $version = $this->getVersion();
        wa()->getResponse()->addCss('plugins/preview/css/style.css?v=' . $version, 'tasks');
        wa()->getResponse()->addJs('plugins/preview/js/preview.js?v=' . $version, 'tasks');
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
