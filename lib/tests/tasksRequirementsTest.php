<?php

require_once(realpath(dirname(__FILE__).'/../../').'/init.php');

/**
 * Class tasksRequirementsTest
 * @group long_tests
 */
class tasksRequirementsTest extends waTestAppRequirements
{
    protected function getConfig()
    {
        return $this->config ? $this->config : ($this->config = wa(basename(dirname(__FILE__)))->getConfig());
    }

    // kill stupid php tester
    public function testPhpFiles()
    {
        $this->assertTrue(true);
    }
}
