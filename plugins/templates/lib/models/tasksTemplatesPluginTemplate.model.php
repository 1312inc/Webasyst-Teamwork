<?php

class tasksTemplatesPluginTemplateModel extends waModel
{
    protected $table = 'tasks_templates_template';

    public static function getIcons()
    {
        return array(
            'contact',
            'search',
            'user',
            'folder',
            'notebook',
            'lock',
            'lock-unlocked',
            'broom',
            'star',
            'livejournal',
            'lightning',
            'light-bulb',
            'pictures',
            'reports',
            'books',
            'marker',
            'lens',
            'alarm-clock',
            'animal-monkey',
            'anchor',
            'bean',
            'car',
            'disk',
            'cookie',
            'burn',
            'clapperboard',
            'bug',
            'clock',
            'cup',
            'home',
            'fruit',
            'luggage',
            'guitar',
            'smiley',
            'sport-soccer',
            'target',
            'medal',
            'phone',
            'store',
            'basket',
            'pencil',
            'lifebuoy',
            'screen'
        );
    }

    public function add($data)
    {
        $data = is_array($data) ? $data : array();
        $data = array_merge($this->getEmptyRow(), $data);
        $data['contact_id'] = wa()->getUser()->getId();
        return $this->insert($data);
    }

    public function update($id, $data)
    {
        $data = is_array($data) ? $data : array();
        $this->updateById($id, $data);
    }

    public function getAvailableTemplates()
    {
        $contact_id = (int)wa()->getUser()->getId();

        $select = "*, IF(contact_id = {$contact_id}, 1, 0) AS is_own";
        $where = "contact_id = {$contact_id} OR is_shared != 0";

        return $this->select($select)->where($where)->order('is_own DESC,name')
                ->fetchAll('id');
    }

    public function getTemplate($id = null)
    {
        $template = null;
        if ($id) {
            $template = $this->getById($id);
        }
        if (!$template) {
            $template = $this->getEmptyRow();
        }
        $template['is_own'] = $template['contact_id'] == wa()->getUser()->getId();
        return $template;
    }

    public static function canEdit($template)
    {
        if ($template['id'] <= 0) {
            return true;
        }
        $user = wa()->getUser();
        return $user->isAdmin('tasks') || $user->getId() == $template['contact_id'];
    }

    public static function canView($template)
    {
        $user = wa()->getUser();
        return $user->isAdmin('tasks') || $user->getId() == $template['contact_id'] || $template['is_shared'];
    }

    public function delete($id)
    {
        return $this->deleteById($id);
    }

}
