<?php
class tasksBackendTagsatcmplController extends waJsonController
{
    public function execute()
    {
        $limit = 50;
        $term = waRequest::request('term', '', 'string');

        $tag_model = new tasksTagModel();
        $tags = $tag_model->getAutocomplete($term, $limit);

        if (waRequest::request('extended')) {
            $this->response = array(
                'is_full' => count($tags) < $limit,
                'tags' => $tags,
            );
        } else {
            $this->response = $tags;
        }
    }
}
