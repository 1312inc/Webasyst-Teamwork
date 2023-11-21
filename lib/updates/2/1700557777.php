<?php
$m = new tasksPushClientModel();
$meta_data = $m->getMetadata();
if (isset($meta_data['api_token']) && $meta_data['api_token']['type'] == 'int') {
    $m->exec("ALTER TABLE `tasks_push_client` MODIFY `api_token` VARCHAR(32) NULL DEFAULT NULL");
}
