<?php

class tasksTagModel extends waModel
{
    protected $table = 'tasks_tag';

    /**
     * Create records for given list of tag names (if not exist yet),
     * and return a list of tag_ids.
     */
    public function addGet($tags)
    {
        $name_ids = array_fill_keys($tags, 0);
        foreach ($this->getByField('name', $tags, true) as $row) {
            $name_ids[$row['name']] = intval($row['id']);
        }
        foreach ($name_ids as $name => $id) {
            if (!$id) {
                $name_ids[$name] = $this->insert(array(
                    'name' => $name,
                ), 2);
            }
        }
        return array_values($name_ids);
    }

    public function getAutocomplete($term, $limit = 50)
    {
        $sql = "SELECT name
                FROM {$this->table}
                WHERE name LIKE '".$this->escape($term, 'like')."%'
                ORDER BY name
                LIMIT ".(int)$limit;
        $result = array();
        foreach ($this->query($sql) as $row) {
            $result[] = $row['name'];
        }
        return $result;
    }

    /**
     * @return bool
     */
    public function deleteUnusedTags()
    {
       $result =  $this->query("
                                    DELETE t
                                    FROM tasks_tag AS t
                                      LEFT JOIN tasks_task_tags as tt
                                        ON t.id = tt.tag_id
                                    WHERE tt.tag_id IS NUll")
                       ->result();

       return $result;
    }
}

