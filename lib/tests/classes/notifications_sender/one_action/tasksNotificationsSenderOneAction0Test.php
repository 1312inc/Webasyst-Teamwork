<?php

require_once(dirname(__FILE__) . '/tasksNotificationsSenderOneActionTest.php');

class tasksNotificationsSenderOneAction0Test extends tasksNotificationsSenderOneActionTest
{
    public function testMethodCheckNeedSendByAction()
    {
        $settings = $this->sender->getContactsNotificationSettings($this->task['assigned_contact_id']);
        $need = $this->sender->checkNeedSentByAction('comment', $settings);
        $this->assertTrue($need);

        $settings = $this->sender->getContactsNotificationSettings($this->task['create_contact_id']);
        $need = $this->sender->checkNeedSentByAction('comment', $settings);
        $this->assertTrue($need);
    }

    public function testMethodCheckNeedSentByTask()
    {
        $contact_id = $this->task['assigned_contact_id'];
        $settings = $this->sender->getContactsNotificationSettings($contact_id);
        $need = $this->sender->checkNeedSentByTask($contact_id, $settings);
        $this->assertTrue($need);

        $contact_id = $this->task['create_contact_id'];
        $settings = $this->sender->getContactsNotificationSettings($contact_id);
        $need = $this->sender->checkNeedSentByTask($contact_id, $settings);
        $this->assertTrue($need);
    }

    public function testMethodPrepareSendMap()
    {
        $send_map = $this->sender->prepareSendMap();
        $this->assertNotEmpty($send_map);
        $this->assertArrayHasKey('comment', $send_map);
        $this->assertInternalType('array', $send_map['comment']);
        $this->assertTrue(in_array($this->task['assigned_contact_id'], $send_map['comment']));
        $this->assertTrue(in_array($this->task['create_contact_id'], $send_map['comment']));
    }
}
