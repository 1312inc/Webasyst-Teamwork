<?php

class tasksTaskTagsModel extends waModel
{
    protected $table = 'tasks_task_tags';
    protected $id = null;


    const CLOUD_MAX_SIZE = 150;
    const CLOUD_MIN_SIZE = 80;
    const CLOUD_MAX_OPACITY = 100;
    const CLOUD_MIN_OPACITY = 30;

    const TAGS_MAX_COUNT = 100;


    /**
     * Assign set of tag names to task, removing olg tags, if needed
     * @param int $task_id
     * @param string[] $tags
     * @param bool $delete_old
     */
    public function save($task_id, $tags, $delete_old = true)
    {
        $task_id = (int)$task_id;
        $tag_model = new tasksTagModel();

        $task_tags = $this->select('tag_id')->where('task_id='.$task_id)->fetchAll('tag_id', true);
        $task_tags = array_keys($task_tags);
        $get_tags = $tag_model->addGet($tags);

        $values = array();
        foreach (array_diff($get_tags, $task_tags) as $tag_id) {
            $values[] = array(
                'task_id' => $task_id,
                'tag_id'  => $tag_id,
            );
        }
        if ($values) {
            $this->multipleInsert($values);
        }

        if ($delete_old) {
            $delete_tags = array_diff($task_tags, $get_tags);
            $this->deleteByField(array(
                'task_id' => $task_id,
                'tag_id'  => $delete_tags
            ));
        }
    }

    /**
     * @param null $project_id
     * @param null $key
     *
     * @return array|null
     */
    public function getCloud($project_id = null, $key = null): ?array
    {
        // Get from cache.
        $cache_key = "tasks_tag_/{$project_id}/{$key}";
        $ttl = tasksOptions::getTagsCloudCacheTtl();
        $cache_tags = new waVarExportCache($cache_key, $ttl, 'tasks');

        // If not cached, this is null.
        // If cached and there's no tags then this is an empty array.
        $tags = $cache_tags->get();

        if ($tags === null) {
            $tags = $this->buildCloud($project_id, $key);
        }

        $cache_tags->set($tags);

        return $tags;
    }

    protected function buildCloud($project_id = null, $key = null)
    {
        $project_condition = null;
        if ($project_id) {
            $project_condition = " AND t.project_id = i:project_id ";
        }

        $tags = $this->query("SELECT tag.id, tag.name, COUNT(*) as count
                                FROM `tasks_task_tags` tt
                                INNER JOIN tasks_task t ON t.id=tt.task_id AND t.status_id<>-1
                                INNER JOIN tasks_tag tag ON tag.id=tt.tag_id
                                WHERE 1=1 {$project_condition}
                                GROUP BY tag.name
                                ORDER BY count DESC", array('project_id' => $project_id))->fetchAll($key);

        if (!$tags) {
            return array();
        }

        $first = current($tags);
        $max_count = $min_count = $first['count'];
        foreach ($tags as $tag) {
            if ($tag['count'] > $max_count) {
                $max_count = $tag['count'];
            }
            if ($tag['count'] < $min_count) {
                $min_count = $tag['count'];
            }
        }
        $diff = $max_count - $min_count;
        if ($diff > 0) {
            $step_size = (self::CLOUD_MAX_SIZE - self::CLOUD_MIN_SIZE) / $diff;
            $step_opacity = (self::CLOUD_MAX_OPACITY - self::CLOUD_MIN_OPACITY) / $diff;
        }
        foreach ($tags as &$tag) {
            if ($diff > 0) {
                $tag['size'] = ceil(self::CLOUD_MIN_SIZE + ($tag['count'] - $min_count) * $step_size);
                $tag['opacity'] = number_format((self::CLOUD_MIN_OPACITY + ($tag['count'] - $min_count) * $step_opacity) / 100, 2, '.', '');
            } else {
                $tag['size'] = ceil((self::CLOUD_MAX_SIZE + self::CLOUD_MIN_SIZE) / 2);
                $tag['opacity'] = number_format(self::CLOUD_MAX_OPACITY, 2, '.', '');
            }
            if (strpos($tag['name'], '/') !== false) {
                $tag['uri_name'] = explode('/', $tag['name']);
                $tag['uri_name'] = array_map('urlencode', $tag['uri_name']);
                $tag['uri_name'] = implode('/', $tag['uri_name']);
            } else {
                $tag['uri_name'] = urlencode($tag['name']);
            }
        }
        unset($tag);

        // Sort tags by name
        uasort($tags, wa_lambda('$a, $b', 'return strcmp($a["name"], $b["name"]);'));

        return $tags;
    }

    public function getData(tasksTask $task)
    {
        $tags = $this->getByTasks(array($task));
        return ifempty($tags[$task['id']], array());
    }

    public function getByTasks($tasks)
    {
        $result = array();
        foreach ($tasks as $t) {
            $result[$t['id']] = array();
        }

        $tags = array();
        foreach ($this->getByField('task_id', array_keys($result), true) as $row) {
            $result[$row['task_id']][$row['tag_id']] = null;
            $tags[$row['tag_id']] = null;
        }
        if (!$tags) {
            return array();
        }

        $tag_model = new tasksTagModel();
        foreach ($tag_model->getById(array_keys($tags)) as $tag) {
            $tags[$tag['id']] = $tag;
        }

        foreach ($result as $task_id => $task_tags) {
            foreach ($task_tags as $tag_id => $_) {
                if (!empty($tags[$tag_id])) {
                    $result[$task_id][$tag_id] = $tags[$tag_id];
                } else {
                    unset($result[$task_id][$tag_id]);
                }
            }
        }

        return $result;
    }
}

