<?php

class tasksListEditAction extends waViewAction
{
    public function execute()
    {
        $list = $this->getList();
        $icons = tasksListModel::getIcons();

        /**
         * UI hook for extend list editor
         *
         * @event backend_list_edit
         * @param array $params
         * @return array[string]array $return[%plugin_id%] array of html output
         * @return string $return[%plugin_id%]['more'] html output
         *
         */
        $params = array(
            'list' => $list
        );

        $backend_list_edit = wa()->event('backend_list_edit', $params);

        $this->view->assign(array(
            'list' => $list,
            'icons' => $icons,
            'backend_list_edit' => $backend_list_edit
        ));
    }

    protected function getList()
    {
        $lm = new tasksListModel();
        $id = (int)$this->getRequest()->get('id');

        if ($id > 0) {
            return $lm->getById($id);
        }

        $list = $lm->getEmptyRow();

        $hash_parsed = $this->getRequest()->request('hash_parsed');

        if (isset($list['hash'])) {
            $list['hash'] = $hash_parsed['hash'];
            $list['hash'] = trim(trim($list['hash']), '/');
        }

        if (isset($hash_parsed['order'])) {
            $list['order'] = (string)$hash_parsed['order'];
        } else {
            $list['order'] = (string)$this->getRequest()->request('order');
        }
        $list['order'] = trim($list['order']);

        if (isset($hash_parsed['filters'])) {
            $list['params'] = (string)$hash_parsed['filters'];
            $list['params'] = trim(trim($list['params']), '/');
        }

        $list['name'] = (string)wa()->getRequest()->request('name');
        $list['name'] = trim($list['name']);

        return $list;
    }
}
