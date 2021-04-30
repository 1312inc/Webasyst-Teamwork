<?php
require_once(realpath(dirname(__FILE__).'/../../../../').'/init.php');

class tasksTaskTagsGetCloudTest extends PHPUnit_Framework_TestCase
{
    public function testGetCloud_compareResultAfterMethod_Access()
    {
        $this->clearCache();
        $model = new fakeTasksTaskTagsModel();
        $result = $model->getCloud();

        $this->assertEquals(getCompareTagsTestData(), $result);

        $this->clearCache();
    }

    public function testGetCloud_emptyTags_ReturnEmptyArray()
    {
        $this->clearCache();
        $model = new fakeTasksTaskTagsModel();
        $model->get_empty = true;

        $result = $model->getCloud();

        $this->assertEmpty($result);
        $this->clearCache();
    }

    /**
     * @throws waException
     * @requires extension skip
 * @group long_tests
     */
    public function testGetCloud_getTagsFromCache_AccessCompareTags()
    {
        $model = new fakeTasksTaskTagsModel();
        $model->getCloud();

        $cache_tags = new waVarExportCache('tasks_tag_//', 600, 'tasks');
        $result = $cache_tags->get();

        $this->assertEquals(getCompareTagsTestData(), $result);
        $this->clearCache();
    }

    public function clearCache()
    {
        $cache_tags = new waVarExportCache('tasks_tag_//', 600, 'tasks');
        $cache_tags->delete();

        $cache = $cache_tags->get();

        if (!empty($cache)) {
            throw new waException('Cache not clear');
        }
    }

    public function tearDown()
    {

    }
}

wa('tasks');

class fakeTasksTaskTagsModel extends tasksTaskTagsModel
{
    public $get_empty = false;

    public function query($sql)
    {
        return new fakeWaDbResultSelect(array('get_empty' => $this->get_empty));
    }
}

class fakeWaDbResultSelect
{
    protected $get_empty = false;

    public function __construct($options = array())
    {
        if (!empty($options['get_empty'])) {
            $this->get_empty = true;
        }
    }

    public function fetchAll()
    {
        if (!$this->get_empty) {
            return getTagsTestData();
        }
        return array();
    }
}

function getCompareTagsTestData()
{
    $tags = array(
        3 =>
            array(
                'id'       => '1',
                'name'     => 'Тег 1',
                'count'    => '1',
                'size'     => 80,
                'opacity'  => '0.30',
                'uri_name' => '%D0%A2%D0%B5%D0%B3+1',
            ),
        4 =>
            array(
                'id'       => '2',
                'name'     => 'Тег 2',
                'count'    => '1',
                'size'     => 80,
                'opacity'  => '0.30',
                'uri_name' => '%D0%A2%D0%B5%D0%B3+2',
            ),
        0 =>
            array(
                'id'       => '3',
                'name'     => 'Тег 3',
                'count'    => '3',
                'size'     => 150,
                'opacity'  => '1.00',
                'uri_name' => '%D0%A2%D0%B5%D0%B3+3',
            ),
        2 =>
            array(
                'id'       => '4',
                'name'     => 'Тег 4',
                'count'    => '2',
                'size'     => 115,
                'opacity'  => '0.65',
                'uri_name' => '%D0%A2%D0%B5%D0%B3+4',
            ),
        1 =>
            array(
                'id'       => '6',
                'name'     => 'Тег 6',
                'count'    => '2',
                'size'     => 115,
                'opacity'  => '0.65',
                'uri_name' => '%D0%A2%D0%B5%D0%B3+6',
            ),
        5 =>
            array(
                'id'       => '7',
                'name'     => 'Тег 7',
                'count'    => '1',
                'size'     => 80,
                'opacity'  => '0.30',
                'uri_name' => '%D0%A2%D0%B5%D0%B3+7',
            ),
        6 =>
            array(
                'id'       => '8',
                'name'     => 'Тег 8',
                'count'    => '1',
                'size'     => 80,
                'opacity'  => '0.30',
                'uri_name' => '%D0%A2%D0%B5%D0%B3+8',
            ),
    );

    return $tags;
}

function getTagsTestData()
{
    $tags = array(
        0 =>
            array(
                'id'    => '3',
                'name'  => 'Тег 3',
                'count' => '3',
            ),
        1 =>
            array(
                'id'    => '6',
                'name'  => 'Тег 6',
                'count' => '2',
            ),
        2 =>
            array(
                'id'    => '4',
                'name'  => 'Тег 4',
                'count' => '2',
            ),
        3 =>
            array(
                'id'    => '1',
                'name'  => 'Тег 1',
                'count' => '1',
            ),
        4 =>
            array(
                'id'    => '2',
                'name'  => 'Тег 2',
                'count' => '1',
            ),
        5 =>
            array(
                'id'    => '7',
                'name'  => 'Тег 7',
                'count' => '1',
            ),
        6 =>
            array(
                'id'    => '8',
                'name'  => 'Тег 8',
                'count' => '1',
            ),
    );

    return $tags;
}