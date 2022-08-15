<?php

$appSettings = new waAppSettingsModel();
$installInProgress = $appSettings->del('tasks', 'install_started');
