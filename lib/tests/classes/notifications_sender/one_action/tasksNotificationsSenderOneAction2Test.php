<?php

require_once(dirname(__FILE__) . '/tasksNotificationsSenderOneActionTest.php');

/**
 * Class tasksNotificationSenderOneAction2Test
 */
class tasksNotificationSenderOneAction2Test extends tasksNotificationsSenderOneActionTest
{
    public function setUp()
    {
        parent::setUp();

        // switch-off
        /**
         * @var tasksConfig $config
         */
        $config = wa('tasks')->getConfig();
        $config->setPersonalSettings(array(
            'notification' => array(
                'action' => 'off'
            )
        ), $this->task['assigned_contact_id']);

        // set 'assign' only
        $config->setPersonalSettings(array(
            'notification' => array(
                'action' => 'assign'
            )
        ), $this->task['create_contact_id']);
    }

    public function testMethodCheckNeedSendByAction()
    {
        $settings = $this->sender->getContactsNotificationSettings($this->task['assigned_contact_id']);
        $need = $this->sender->checkNeedSentByAction('comment', $settings);
        $this->assertFalse($need);

        $settings = $this->sender->getContactsNotificationSettings($this->task['create_contact_id']);
        $need = $this->sender->checkNeedSentByAction('comment', $settings);
        $this->assertFalse($need);
    }

    public function testMethodCheckNeedSentByTask()
    {
        $contact_id = $this->task['assigned_contact_id'];
        $settings = $this->sender->getContactsNotificationSettings($contact_id);
        $need = $this->sender->checkNeedSentByTask($contact_id, $settings);
        $this->assertFalse($need);

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
        $this->assertFalse(in_array($this->task['create_contact_id'], $send_map['comment']));
        $this->assertFalse(in_array($this->task['assigned_contact_id'], $send_map['comment']));
    }
}
