<?php

class tasksListDeleteController extends waJsonController
{
    public function execute()
    {
        $id = $this->getId();
        $lm = new tasksListModel();
        $list = $lm->getById($id);
        if ($list && $list['contact_id'] == $this->getUserId()) {

            /**
             * @event list_delete
             *
             * @param array [string]mixed $params
             * @param array [string]array $params['ids'] Array of IDs of deleting list entries
             *
             * @return void
             */
            $params = ['ids' => [$list['id']]];
            wa()->event('list_delete', $params);

            $lm->deleteById($list['id']);
        }

        $this->response = [
            'title' => wa()->whichUI() == '1.3' ? _w("Create list") : _w('Save to my filters'),
        ];
    }

    protected function getId()
    {
        return (int) $this->getRequest()->post('id');
    }
}
