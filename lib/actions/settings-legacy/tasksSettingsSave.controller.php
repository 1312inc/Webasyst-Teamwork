<?php
/**
 * Accepts submit for general settings form (i.e. list of project statuses).
 */
class tasksSettingsSaveController extends waJsonController
{
    public function execute()
    {
        if (!wa()->getUser()->isAdmin('tasks')) {
            throw new waRightsException(_w('Access denied'));
        }

        if (!waRequest::post()) {
            return;
        }

        $data = self::getData();
        if ($data['errors']) {
            $this->errors = $data['errors'];
            return;
        }

        $update_later = array();
        $status_model = new tasksStatusModel();
        $empty_row = $status_model->getEmptyRow();
        unset($empty_row['id']);

        // Delete statuses
        if ($data['delete']) {
            $status_model->deleteById($data['delete']);

            $task_model = new tasksTaskModel();
            $task_model->updateByField('status_id', $data['delete'], array(
                'status_id' => 0, // new
            ));
        }

        // Update existing statuses (including sort order)
        foreach($status_model->getAll() as $s) {
            $update = ifset($data['update'][$s['id']], array());
            $update['sort'] = $data['sort'][$s['id']];
            unset($update['id']);
            foreach($update as $k => $v) {
                if (!array_key_exists($k, $empty_row)) {
                    $update_later[$s['id']][$k] = $v;
                    unset($update[$k]);
                } else if ($s[$k] == $v) {
                    unset($update[$k]);
                }
            }
            $update && $status_model->updateById($s['id'], $update);
            unset($data['update'][$s['id']]);
        }

        // Add new statuses
        foreach($data['add'] as $sid => $s) {
            unset($s['id']);
            $s['sort'] = $data['sort'][$sid];

            $later = array();
            foreach($s as $k => $v) {
                if (!array_key_exists($k, $empty_row)) {
                    $later[$k] = $v;
                }
            }

            $status_id = $status_model->insert($s);
            if ($later) {
                $update_later[$status_id] = $later;
            }
        }

        // Save params
        $status_params_model = new tasksStatusParamsModel();
        foreach($update_later as $status_id => $items) {
            if (!empty($items['params']) && is_array($items['params'])) {
                unset($items['params']['_exist']);
                $status_params_model->set($status_id, $items['params']);
            }
        }

        // Update special status params that have no record in tasks_status
        if ($data['update']) {
            $this->errors[''] = 'Modifying special status params is not implemented yet.'; // !!!
        }
    }

    protected static function getData()
    {
        $statuses = tasksHelper::getStatuses(null, false);
        $data = waRequest::post('status', array(), 'array');
        $status_delete = waRequest::post('status_delete', array(), 'array');

        $add = array();
        $sort = array();
        $update = array();
        $errors = array();
        $sort_counter = 1;
        foreach($data as $status_id => $status_data) {
            unset($status_data['exists']);
            foreach(self::validateStatus($status_data) as $field => $err) {
                $errors["status[{$status_id}]".$field] = $err;
            }

            $sort[$status_id] = $sort_counter++;
            if (!empty($statuses[$status_id])) {
                if ($status_data) {
                    $update[$status_id] = $status_data;
                }
            } else if (!wa_is_int($status_id)) {
                $add[$status_id] = $status_data;
            }
        }

        $delete = array();
        foreach(array_keys($statuses) as $status_id) {
            if (empty($data[$status_id]) && empty($statuses[$status_id]['special'])) {
                $delete[$status_id] = $status_id;
            }
        }

        return array(
            'add' => $add,
            'update' => $update,
            'delete' => $delete,
            'errors' => $errors,
            'sort' => $sort,
        );
    }

    protected static function validateStatus($s)
    {
        $errors = array();
        if (isset($s['name']) && empty($s['name'])) {
            $errors["[name]"] = _ws('This field is required.');
        }
        if (isset($s['button']) && empty($s['button'])) {
            $errors["[button]"] = _ws('This field is required.');
        }
        return $errors;
    }
}

