<?php

// fix previous mistype
$model = new tasksReleasesPluginTaskExtModel();
$model->updateByField(
    array('resolution' => "wont wix"),
    array('resolution' => "wont_fix")
);
