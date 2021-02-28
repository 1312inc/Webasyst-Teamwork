<?php

/**
 * Single task page.
 */
class tasksPreviewPluginTaskInfoAction extends tasksTasksInfoAction
{
    public function execute()
    {
        parent::execute();

        $vars = $this->view->getVars();
        $task = $vars['task'];

        $data = $this->getData();
        $task = $this->applyData($task, $data);

        $this->workup($task);
        $this->applyNewTags($task);
        $this->view->assign('task', $task);
    }

    protected function getData()
    {
        $data = (array)$this->getRequest()->post();
        return $data['data'];
    }

    protected function applyData($task, $data)
    {
        foreach ($data as $key => $value) {
            $task[$key] = $value;
        }
        return $task;
    }

    protected function applyNewTags(&$task)
    {
        $tag_names = tasksTaskObj::extractTags($task['text']);
        $tags = $this->getTagsByNames($tag_names);
        $task_tags = $task['tags'];
        foreach ($tags as $tag_id => $tag_name) {
            $task_tags[$tag_id] = $tag_name;
        }
        $task['tags'] = $task_tags;
    }

    protected function getTagsByNames($tag_names)
    {
        $tm = new tasksTagModel();
        $tags = array();
        foreach ($tm->getByField('name', $tag_names, true) as $tag) {
            $tags[$tag['id']] = $tag['name'];
        }

        $tag_names_map = array_fill_keys($tag_names, true);

        foreach ($tags as $tag_id => $tag_name) {
            if (isset($tag_names_map[$tag_name])) {
                unset($tag_names_map[$tag_name]);
            }
        }

        // META ID for mark that tag isn't exist yet
        $negative_index = -count($tag_names_map);
        foreach ($tag_names_map as $tag_name => $_) {
            $tags[$negative_index++] = $tag_name;
        }

        return $tags;
    }

}
