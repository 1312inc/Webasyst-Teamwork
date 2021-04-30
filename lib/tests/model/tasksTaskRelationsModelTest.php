<?php
require_once(realpath(dirname(__FILE__).'/../../../').'/init.php');

/**
 * Class tasksTaskRelationsModelTest
 * @group long_tests
 */
class tasksTaskRelationsModelTest extends PHPUnit_Framework_TestCase
{
    public $relations_model;

    public function setUp()
    {
        wa('tasks');
        waTestEnvironment::getInstance()->setUpTemporaryTablesForApps(array('tasks'));
        $this->relations_model = new tasksTaskRelationsModel();
    }

    public function testSave_identicalIds_nothingSave()
    {
        $new_ids = array(
            100 => array(),
            200 => array()
        );
        $old_ids = array(
            100 => array(),
            200 => array()
        );

        $this->relations_model->save(1, $new_ids, $old_ids);

        $data = $this->relations_model->getAll();

        $this->assertEquals(array(), $data);
    }

    public function testSave_onlyNewIds_saveAll()
    {
        $new_ids = array(
            100 => array(),
            200 => array()
        );

        $this->relations_model->save(1, $new_ids);

        $data = $this->relations_model->getAll();

        $this->assertEquals(array(
            0 =>
                array(
                    'parent_id' => '1',
                    'child_id'  => '100',
                ),
            1 =>
                array(
                    'parent_id' => '1',
                    'child_id'  => '200',
                ),
        ), $data);
    }

    public function testSave_onlyOldIds_deleteAll()
    {
        $old_ids = array(
            100 => array(),
            200 => array()
        );

        $this->relations_model->multipleInsert(
            array(
                array(
                    'parent_id' => '1',
                    'child_id'  => '100',
                ),
                array(
                    'parent_id' => '1',
                    'child_id'  => '200',
                ),
            )
        );
        $data_before_save = count($this->relations_model->getAll());


        $this->assertEquals(2, $data_before_save);
        $this->relations_model->save(1, array(), $old_ids);

        $data = $this->relations_model->getAll();
        $this->assertEquals(array(), $data);
    }

    public function testSave_addNewIds_saveData()
    {
        $new_ids = array(
            100 => array(),
            200 => array(),
            300 => array(),
        );
        $old_ids = array(
            100 => array(),
            200 => array()
        );


        $this->relations_model->save(1, $new_ids, $old_ids);
        $data = $this->relations_model->getAll();
        $this->assertEquals(array(
            array(
                'parent_id' => '1',
                'child_id'  => '300',
            )
        ),$data);
    }

    public function testSave_deleteOldId_relationsDeleted()
    {
        $new_ids = array(
            200 => array(),
        );
        $old_ids = array(
            100 => array(),
            200 => array()
        );

        $this->relations_model->multipleInsert(
            array(
                array(
                    'parent_id' => '1',
                    'child_id'  => '100',
                ),
                array(
                    'parent_id' => '1',
                    'child_id'  => '200',
                ),
            )
        );
        $data_before_save = count($this->relations_model->getAll());

        $this->assertEquals(2, $data_before_save);
        $this->relations_model->save(1, $new_ids, $old_ids);

        $data = $this->relations_model->getAll();
        $this->assertEquals(array(
            array(
                'parent_id' => '1',
                'child_id'  => '200',
            )
        ),$data);
    }

    public function testDeleteRelation_arrayParams_trueResultAndRemained1Row()
    {
        $this->relations_model->multipleInsert(array(
            array('parent_id' => 1, 'child_id' => 2),
            array('parent_id' => 2, 'child_id' => 3),
            array('parent_id' => 3, 'child_id' => 4),
        ));

        $ids = array(1, 2);
        $result = $this->relations_model->deleteRelation($ids);
        $this->assertTrue($result);

        $count = $this->relations_model->countAll();

        $this->assertEquals(1, $count);
    }

    public function testDeleteRelation_stringParams_trueResultAndRemained1Row()
    {
        $this->relations_model->multipleInsert(array(
            array('parent_id' => 1, 'child_id' => 2),
            array('parent_id' => 2, 'child_id' => 3),
        ));

        $ids = 1;
        $result = $this->relations_model->deleteRelation($ids);
        $this->assertTrue($result);

        $count = $this->relations_model->countAll();

        $this->assertEquals(1, $count);
    }

    public function testGetRelations_stringParams_returnOnlyChilds()
    {
        $this->relations_model->multipleInsert(array(
            array('parent_id' => 1, 'child_id' => 2),
            array('parent_id' => 2, 'child_id' => 3),
        ));

        $ids = 1;
        $result = $this->relations_model->getRelations($ids);

        $this->assertArrayHasKey('childs', $result);
        $this->assertArrayNotHasKey('parent', $result);
    }

    public function testGetRelations_arrayParams_returnTasksArray()
    {
        $this->relations_model->multipleInsert(array(
            array('parent_id' => 1, 'child_id' => 2),
            array('parent_id' => 2, 'child_id' => 3),
        ));

        $ids = array(1, 2);
        $result = $this->relations_model->getRelations($ids);

        $this->assertEquals(array(1, 2, 3), array_keys($result));
    }

    public function tearDown()
    {
        waTestEnvironment::getInstance()->tearDownTemporaryTablesForApps();
    }
}