<?php

class tasksTemplatesPlugin extends waPlugin
{
    public function backendSidebar()
    {
        $component = new tasksTemplatesPluginSidebarComponent();
        return array(
            'top_li' => $component->linkHtml()
        );
    }

    public function backendAssets()
    {
        $version = $this->getVersion();
        wa()->getResponse()->addJs('plugins/templates/js/plugin.js?v=' . $version, 'tasks');
        wa()->getResponse()->addJs('plugins/templates/js/templateEdit.js?v=' . $version, 'tasks');
        wa()->getResponse()->addJs('plugins/templates/js/taskEdit.js?v=' . $version, 'tasks');
        wa()->getResponse()->addCss('plugins/templates/css/style.css?v=' . $version, 'tasks');
    }

    public function backendTaskEdit()
    {
        $component = new tasksTemplatesPluginSidebarComponent();
        return array(
            'header' => $component->headerLinkHtml()
        );
    }
}
