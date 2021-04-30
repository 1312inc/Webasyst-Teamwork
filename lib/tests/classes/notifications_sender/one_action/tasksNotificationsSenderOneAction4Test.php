<?php

require_once(dirname(__FILE__) . '/tasksNotificationsSenderOneActionTest.php');

/**
 * Class tasksNotificationsSenderOneAction4Test
 */
class tasksNotificationsSenderOneAction4Test extends tasksNotificationsSenderOneActionTest
{
    /**
     * @var waContact
     */
    protected $subscribed_contact;

    public function setUp()
    {
        parent::setUp();

        // set projects
        $subscribed_contact = $this->createContact();

        /**
         * @var tasksConfig $config
         */
        $config = wa('tasks')->getConfig();
        $config->setPersonalSettings(array(
            'notification' => array(
                'task' => array('project'),
                'project' => array($this->task['project_id'])
            )
        ), $subscribed_contact->getId());

        $this->subscribed_contact = $subscribed_contact;
    }

    public function testMethodCheckNeedSendByAction()
    {
        $settings = $this->sender->getContactsNotificationSettings($this->subscribed_contact->getId());
        $need = $this->sender->checkNeedSentByAction('comment', $settings);
        $this->assertTrue($need);
    }

    public function testMethodCheckNeedSentByTask()
    {
        $contact_id = $this->subscribed_contact->getId();
        $settings = $this->sender->getContactsNotificationSettings($contact_id);
        $need = $this->sender->checkNeedSentByTask($contact_id, $settings);
        $this->assertTrue($need);
    }

    public function testMethodGetContactIdsNeedSentTo()
    {
        $settings = $this->sender->getContactsNotificationSettings('all');
        $contact_ids = $this->sender->getContactIdsNeedSentTo('comment', $settings);
        $this->assertTrue(in_array($this->subscribed_contact->getId(), $contact_ids));
    }

    public function testMethodPrepareSendMap()
    {
        $send_map = $this->sender->prepareSendMap();
        $this->assertNotEmpty($send_map);
        $this->assertArrayHasKey('comment', $send_map);
        $this->assertInternalType('array', $send_map['comment']);
        $this->assertTrue(in_array($this->task['assigned_contact_id'], $send_map['comment']));
        $this->assertTrue(in_array($this->task['create_contact_id'], $send_map['comment']));
        $this->assertTrue(in_array($this->subscribed_contact->getId(), $send_map['comment']));
    }
}
