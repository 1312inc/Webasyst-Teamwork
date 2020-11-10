<?php

class tasksTemplatesPluginSidebarComponent extends tasksTemplatesPluginComponent
{
    public function linkHtml()
    {
        $tm = new tasksTemplatesPluginTemplateModel();
        return $this->render("sidebar/Link.html", array(
            'templates' => $tm->getAvailableTemplates()
        ));
    }

    public function headerLinkHtml()
    {
        $tm = new tasksTemplatesPluginTemplateModel();
        return $this->render("header/HeaderLink.html", array(
            'templates' => $tm->getAvailableTemplates()
        ));
    }
}
