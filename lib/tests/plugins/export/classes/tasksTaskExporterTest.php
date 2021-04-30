<?php

require_once(dirname(__FILE__) . '/../../../tasksTestCase.php');

class tasksTaskExporterTest extends tasksTestCase
{
    public function testExport()
    {
        $tasks = array();

        $tasks_count = 10;
        for ($i = 0; $i < $tasks_count; $i++) {
            $task = $this->createTask();
            $tasks[$task['id']] = $task;
        }

        $exporter = new tasksExportPluginTasksExporter(array(
            'hash' => 'id/' . join(',', array_keys($tasks)),
            'check_rights' => false
        ));

        $chunk_size = 3;
        $steps_number = (int)ceil($tasks_count / $chunk_size);
        for ($step = 0; $step < $steps_number; $step++) {
            $is_done = $exporter->exportChunk($chunk_size);
            if ($step < $steps_number - 1) {
                $this->assertFalse($is_done, "Failed on step #{$step}");
            } else {
                $this->assertTrue($is_done, "Failed on last step. Export must be done");
            }
        }

        $process_id = $exporter->getProcessId();
        $exporter = new tasksExportPluginTasksExporter(array(
            'process_id' => $process_id
        ));

        $result = $exporter->getExportResultChunk(1);
        $this->assertNotEmpty($result);
        $this->assertArrayHasKey('fields', $result);
        $this->assertNotEmpty($result['fields']);
        $this->assertEquals(1, count($result));

        $fields = array_keys($result['fields']);
        $this->checkReleasesFields($fields);


        $chunk_size = 3;
        $steps_number = (int)ceil($tasks_count / $chunk_size);
        for ($step = 0; $step < $steps_number; $step++) {
            $result = $exporter->getExportResultChunk($chunk_size);
            if ($step < $steps_number - 1) {
                $this->assertEquals($chunk_size, count($result), "Failed on step #{$step}");
            } else {
                $this->assertLessThanOrEqual($chunk_size, count($result), "Failed on last step");
            }
            foreach ($result as $task_id => $res) {
                $res_fields = array_keys($res);
                $this->assertEquals($fields, $res_fields);
                $this->checkReleasesFields($res_fields);
            }
        }

    }

    public function testExportApplyFilter()
    {
        $tasks = array();

        $tasks_count = 10;
        for ($i = 0; $i < $tasks_count; $i++) {
            $task = $this->createTask();
            $tasks[$task['id']] = $task;
        }

        $exporter = new tasksExportPluginTasksExporter(array(
            'hash' => 'id/' . join(',', array_keys($tasks)),
            'filters' => 'status_id=1',
            'check_rights' => false
        ));

        $is_done = $exporter->exportChunk(1);
        $this->assertTrue($is_done);
    }

    public function testExportApplyOrder()
    {
        $tasks = array();

        $m = new tasksTaskModel();

        $tasks_count = 3;
        for ($i = 0; $i < $tasks_count; $i++) {
            $task = $this->createTask();
            $tasks[$task['id']] = $task;

            if ($i > 0) {
                $time = strtotime("+ {$i} second");
            } else {
                $time = time();
            }

            $date = date('Y-m-d H:i:s', $time);

            // so that there is not equal create_datetime/update_datetime values
            $m->updateById($task['id'], array(
                'create_datetime' => $date,
                'update_datetime' => $date
            ));

        }

        $exporter = new tasksExportPluginTasksExporter(array(
            'hash' => 'id/' . join(',', array_keys($tasks)),
            'order' => 'newest',
            'check_rights' => false
        ));

        $exporter->exportChunk($tasks_count);
        $result = $exporter->getExportResultChunk($tasks_count + 1);
        unset($result['fields']);

        $task_ids = array_keys($tasks);
        $task_ids = array_reverse($task_ids);
        $this->assertEquals($task_ids, array_keys($result));
    }

    protected function checkReleasesFields($fields)
    {
        if (!$this->isReleasesOn()) {
            return;
        }
        $model = new tasksReleasesPluginTaskExtModel();
        $releases_fields = array();
        foreach ($model->getMetadata() as $field_id => $_) {
            if ($field_id !== 'task_id') {
                if (in_array($field_id, array('type', 'gravity', 'resolution'))) {
                    $releases_fields[] = "plugin_releases_{$field_id}_name";
                } else {
                    $releases_fields[] = "plugin_releases_{$field_id}";
                }
            }
        }
        $map = array_fill_keys($fields, true);
        foreach ($releases_fields as $field_id) {
            $this->assertArrayHasKey($field_id, $map, "Failed that field {$field_id} not exists");
        }

    }

    protected function isReleasesOn()
    {
        static $on;
        if ($on === null) {
            $plugins = wa('tasks')->getConfig()->getPlugins();
            $on = isset($plugins['releases']);
        }
        return $on;
    }

}
