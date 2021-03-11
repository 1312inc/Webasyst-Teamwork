<?php

final class tasksTagSaveHandler
{
    public function handle(tasksTask2 $task, tasksTask2 $prevTask = null): void
    {
        $tasksTaskTagsModel = new tasksTaskTagsModel();
        $collectHeaderTags = [];

        //If have prev version, need search tags which set in autocomplete and resave them
        if ($prevTask && $prevTask->getId()) {
            $parseOldTags = tasksTask::extractTags($prevTask->getText());
            $oldTags = $tasksTaskTagsModel->getByTasks([['id' => $prevTask->getId()]]);

            if (!empty($oldTags[$prevTask->getId()])) {
                $oldTags = $oldTags[$prevTask->getId()];
                foreach ($oldTags as $key => $tag) {
                    $id = array_search($tag['name'], $parseOldTags, true);
                    if ($id === false) {
                        //Remove if tags set in task body
                        $collectHeaderTags[] = $tag['name'];
                    } else {
                        //Search tags which set in autocomplete field
                        unset($oldTags[$key]);
                    }
                }
            }
        }

        $parseNewTags = tasksTask::extractTags($task->getText());
        $new_tags = array_merge($parseNewTags, $collectHeaderTags);

        $tasksTaskTagsModel->save($task->getId(), $new_tags);
    }
}
