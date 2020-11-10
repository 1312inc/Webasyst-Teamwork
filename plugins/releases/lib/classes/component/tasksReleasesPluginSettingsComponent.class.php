<?php

class tasksReleasesPluginSettingsComponent extends tasksReleasesPluginComponent
{
    public function getSidebarItem()
    {
        return $this->render("settings/sidebar/item.html");
    }
}
