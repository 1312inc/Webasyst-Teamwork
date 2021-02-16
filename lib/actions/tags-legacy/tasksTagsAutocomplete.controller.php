<?php

class tasksTagsAutocompleteController extends waController
{
    public $TAGS_LIMIT = 10;

    public function execute()
    {
        $term = waRequest::get('term', '', waRequest::TYPE_STRING_TRIM);

        $tag_model = new tasksTagModel();
        $term = $tag_model->escape($term, 'like');
        $where = "name LIKE '$term%'";

        $tags = array();
        foreach ($tag_model->select('*')->where($where)->limit($this->TAGS_LIMIT)->fetchAll() as $tag) {
            $tags[] = array(
                'id'    => $tag['id'],
                'name' => $tag['name'],
                'label' => htmlspecialchars($tag['name'])
            );
        }
        echo json_encode($tags);
    }
}
