<?php

/**
 * Actions with tags in tasks list and single task view.
 */
class tasksTagsActions extends waActions
{
    // Assign favorite tag to task
    protected function setAction()
    {
        $task_ids = waRequest::post('task_id');
        if (wa_is_int($task_ids)) {
            $task_ids = [$task_ids];
        } else {
            $task_ids = waRequest::post('task_id', [], waRequest::TYPE_ARRAY_INT);
        }

        $tag_model = new tasksTagModel();
        $tag_id = waRequest::post('tag_id', 0, waRequest::TYPE_INT);
        $tag_name = waRequest::post('tag_name', '', waRequest::TYPE_STRING_TRIM);

        $tag_name = trim(str_replace("\xc2\xa0", ' ', $tag_name));
        if (empty($tag_name) && $tag_id < 0) {
            return;
        }

        $tag = $tag_model->select('*')
            ->where('id = i:id OR name = s:name', ['id' => $tag_id, 'name' => $tag_name])
            ->fetchAssoc();

        if (empty($tag)) {
            $tag_id = $tag_model->insert([
                'name' => $tag_name,
            ]);
            $tag = $tag_model->getById($tag_id);
        }

        if (empty($tag)) {
            throw new waException('Error creating new tag');
        }

        // Add tag to tasks_task_tags
        $task_tags_model = new tasksTaskTagsModel();
        $task_tags_model->multipleInsert([
            'task_id' => $task_ids,
            'tag_id' => $tag['id'],
        ]);

        $this->displayJson($tag);
    }

    // Remove a tag from task
    protected function unsetAction()
    {
        $tag_id = waRequest::post('tag_id', 0, waRequest::TYPE_INT);
        $task_id = waRequest::post('task_id', 0, waRequest::TYPE_INT);
        if (!$task_id || !$tag_id) {
            return;
        }

        $task = new tasksTask($task_id);
        if (!$task->exists()) {
            return;
        }

        $tag_model = new tasksTagModel();
        $tag = $tag_model->getById($tag_id);
        if (!$tag) {
            return;
        }

        // Remove tag from task text
        $task_model = new tasksTaskModel();
        $task_model->updateById($task_id, [
            'update_datetime' => false, // sneaky update
            'text' => self::removeTagFromText($task['text'], $tag['name']),
        ]);

        // Remove tag from tasks_task_tags
        $task_tags_model = new tasksTaskTagsModel();
        $task_tags_model->deleteByField([
            'task_id' => $task_id,
            'tag_id' => $tag_id,
        ]);

        $tag_model->deleteUnusedTags();

        $this->displayJson('ok');
    }

    // Turn a favorite tag into common (non-favorite) one
    protected function deleteAction()
    {
        $id = waRequest::post('id', 0, waRequest::TYPE_INT);
        if (!$id) {
            throw new waException('id is not specified', 400);
        }
        if (!wa()->getUser()->isAdmin('tasks')) {
            throw new waRightsException(_w('Access denied'));
        }

        $tag_model = new tasksTagModel();
        $tag_model->updateById($id, [
            'favorite' => 0,
        ]);

        $tag_model->deleteUnusedTags();
        $this->displayJson('ok');
    }

    protected static function removeTagFromText($text, $tag_name)
    {
        $escaped_tag = preg_quote('#' . $tag_name);

        // When tag in question follows another tag directly,
        // remove it from text altogether.
        $text = preg_replace('~(#[^\s]+)\s+' . $escaped_tag . '\b~', '\\1', $text);

        // When tag is the only thing on a line, remove it.
        $text = preg_replace('~^[ \t]*' . $escaped_tag . '[ \t]*$~m', '', $text);

        // Otherwise just remove the hash (#) from the tag
        $text = preg_replace('~' . $escaped_tag . '\b~u', $tag_name, $text);

        return $text;
    }
}

