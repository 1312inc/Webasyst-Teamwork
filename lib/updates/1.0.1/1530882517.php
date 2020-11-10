<?php

$project_model = new tasksProjectModel();
$project = $project_model->getAll('id');

if ($project) {
    foreach ($project as $id => $data) {
        try {
            $project_model->recountTasksNumber($id);
        } catch (waException $e) {

        }
    }
}