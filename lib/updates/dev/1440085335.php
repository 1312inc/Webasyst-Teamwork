<?php

$file_db = $this->getAppPath('lib/config/db.php');
if (file_exists($file_db)) {
    $schema = include($file_db);
    $model = new waModel();
    $model->createSchema($schema);
}
