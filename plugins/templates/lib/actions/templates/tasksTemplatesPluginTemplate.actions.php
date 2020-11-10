<?php

class tasksTemplatesPluginTemplateActions extends waViewActions
{
    public function editAction()
    {
        $id = (int)$this->getRequest()->request('id');
        $tm = new tasksTemplatesPluginTemplateModel();
        $template = $tm->getTemplate($id);
        if (!tasksTemplatesPluginTemplateModel::canEdit($template)) {
            throw new waRightsException("Доступ запрещен");
        }
        $this->view->assign(array(
            'icons' => tasksTemplatesPluginTemplateModel::getIcons(),
            'template' => $template
        ));
    }

    public function saveAction()
    {
        $data = (array)$this->getRequest()->post('data');

        $errors = $this->validate($data);
        if ($errors) {
            return $this->sendFailResponse($errors);
        }

        $id = (int)$this->getRequest()->request('id');
        if ($id > 0) {
            $template = $this->update($id, $data);
        } else {
            $template = $this->add($data);
        }
        return $this->sendResponse(array('template' => $template));
    }

    public function deleteAction()
    {
        $id = (int)$this->getRequest()->post('id');
        $tm = new tasksTemplatesPluginTemplateModel();
        $template = $tm->getTemplate($id);
        if (tasksTemplatesPluginTemplateModel::canEdit($template)) {
            $tm->delete($template['id']);
            return $this->sendResponse(array('deleted' => 1));
        }
        return $this->sendResponse(array('deleted' => 0));
    }

    public function infoAction()
    {
        $id = waRequest::request('id', 0, waRequest::TYPE_INT);
        $tm = new tasksTemplatesPluginTemplateModel();
        $template = $tm->getTemplate($id);
        if (tasksTemplatesPluginTemplateModel::canView($template)) {
            return $this->sendResponse(array('template' => $template));
        }
        return $this->sendResponse(array('template' => null));
    }

    protected function isAdmin()
    {
        return wa()->getUser()->isAdmin('tasks');
    }

    protected function sendFailResponse($errors = array())
    {
        return $this->sendJson(array('status' => 'fail', 'errors' => $errors));
    }

    protected function sendResponse($response = array())
    {
        return $this->sendJson(array('status' => 'ok', 'data' => $response));
    }

    protected function sendJson($data)
    {
        $this->getResponse()->addHeader('Content-Type', 'application/json');
        $this->getResponse()->sendHeaders();
        die(json_encode($data));
    }

    protected function validate($data)
    {
        $errors = array();
        if (strlen($data['name']) <= 0) {
            $errors['name'] = _w('Name is required');
        }
        return $errors;
    }

    protected function add($data)
    {
        $tm = new tasksTemplatesPluginTemplateModel();
        $id = $tm->add($data);
        if ($id <= null) {
            return null;
        }
        return $tm->getById($id);
    }

    protected function update($id, $data)
    {
        $tm = new tasksTemplatesPluginTemplateModel();
        $tm->update($id, $data);
        return $tm->getById($id);
    }
}
