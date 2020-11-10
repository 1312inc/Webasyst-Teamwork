<?php

class tasksReleasesPluginInstaller extends tasksInstaller
{
    public function installAll()
    {
        $this->fillPredefinedTypes();
    }

    public function fillPredefinedTypes()
    {
        $model = new tasksReleasesPluginTaskTypesModel();
        $model->multipleInsert(array(
            array('id' => 'bug', 'name' => 'Bug', 'sort' => 0),
            array('id' => 'sr',  'name' => 'SR', 'sort' => 1),
            array('id' => 'dev', 'name' => 'Dev', 'sort' => 2)
        ));
    }
}
