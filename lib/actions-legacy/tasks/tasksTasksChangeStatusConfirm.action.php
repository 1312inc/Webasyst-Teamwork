<?php

class tasksTasksChangeStatusConfirmAction extends waViewAction
{
    public function execute()
    {
        $this->view->assign(array(
            'contact' => $this->getContact(),
            'status' => $this->getStatus()
        ));
    }

    protected function getStatus()
    {
        $status_id = (int)$this->getRequest()->get('status_id');
        $statuses = tasksHelper::getStatuses();
        if (!isset($statuses[$status_id])) {
            return null;
        }
        $status = $statuses[$status_id];
        $statuses = array($status);
        tasksHelper::workupStatusesForView($statuses);
        return reset($statuses);
    }

    protected function getContact()
    {
        $contact_id = (int)$this->getRequest()->get('contact_id');
        $col = new waContactsCollection('id/'.$contact_id);
        $contacts = $col->getContacts('id,name,photo_url_32', 0, 1);
        return isset($contacts[$contact_id]) ? $contacts[$contact_id] : array(
            'id' => $contact_id,
            'name' => 'Unknown contact with ID = ' . $contact_id,
            'photo_url_32' => waContact::getPhotoUrl(0, 0, 32, 32)
        );
    }
}
