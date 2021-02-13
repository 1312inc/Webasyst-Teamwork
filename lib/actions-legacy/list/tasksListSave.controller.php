<?php

class tasksListSaveController extends waJsonController
{
    public function execute()
    {
        $data = $this->getData();

        $errors = $this->validate($data);
        if ($errors) {
            $this->errors = $errors;
            return;
        }

        $id = $this->getId();
        if ($id > 0) {
            // not supported yet
            return;
        }

        $view = $this->add($data);

        $this->triggerEvent($view, array(
            'type' => 'add'
        ));

        $this->response = array(
            'view' => $view,
            'title' => sprintf(_w('Delete list “%s”'), $view['name'])
        );
    }

    protected function add($data)
    {
        $lm = new tasksListModel();
        $id = $lm->add($data);
        if ($id <= null) {
            return null;
        }
        return $lm->getById($id);
    }

    protected function validate($data)
    {
        $errors = array();
        if (strlen($data['name']) <= 0) {
            $errors['name'] = _w('A list name is required.');
        }
        return $errors;
    }

    protected function getData()
    {
        return (array)$this->getRequest()->post('data');
    }

    protected function getId()
    {
        return (int)$this->getRequest()->get('id');
    }

    protected function triggerEvent($list, $params)
    {
        /**
         * @param array $list
         * @param string type 'add' | 'edit'
         * @param null|array $prev_list
         * @event list_save
         */
        $params['list'] = $list;
        wa()->event('list_save', $params);
    }
}
