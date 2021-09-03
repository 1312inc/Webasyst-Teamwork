<?php

class tasksReleasesPluginSidebarComponent extends tasksReleasesPluginComponent
{
    public function getSidebarItem()
    {
        return $this->render("sidebar/item.html");
    }
}
