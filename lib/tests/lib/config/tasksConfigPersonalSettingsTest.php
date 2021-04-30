<?php

require_once(dirname(__FILE__) . '/../../tasksTestCase.php');

/**
 * Class tasksConfigPersonalSettingsTest
 * @requires extension skip
 * @group long_tests
 */
class tasksConfigPersonalSettingsTest extends tasksTestCase
{
    public function testPersonalSettings()
    {
        $contact = $this->createContact();

        /**
         * @var tasksConfig $config
         */
        $config = wa()->getConfig();
        $config->setPersonalSettings(array(
            'notification' => array(
                'task' => array('favorites')
            )
        ), $contact->getId());

        $settings = $config->getPersonalSettings($contact->getId());
        $this->assertArrayHasKey('notification', $settings);
        $this->assertNotEmpty($settings['notification']);
        $this->assertArrayHasKey('task', $settings['notification']);
        $this->assertEquals(array('favorites'), $settings['notification']['task']);
    }
}
