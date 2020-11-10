<?php

abstract class tasksMigrateWebasystTransport extends tasksMigrateTransport
{
    const STATUS_ADD = -100;
    const STATUS_IGNORE = -100500;

    protected function initOptions()
    {
        parent::initOptions();
        waHtmlControl::registerControl('StatusControl', array(&$this, "settingStatusControl"));
    }

    public function validate($result, &$errors)
    {
        try {
            if ($result) {
                $option = array(
                    'value'        => true,
                    'control_type' => waHtmlControl::CHECKBOX,
                    'title'        => _wp('Skip empty works'),
                    'description'  => _wp('If work has no tasks it will be skipped'),
                );
                $this->addOption('skip_empty', $option);

                $option = array(
                    'value'        => true,
                    'control_type' => waHtmlControl::CHECKBOX,
                    'title'        => _wp('Skip ended works'),
                    'description'  => _wp('TODO: add description. By default they are imported into archive'),
                );
                $this->addOption('skip_ended', $option);

                #orders state map
                $option = array(
                    'control_type' => 'StatusControl',
                    'title'        => _wp('Status map'),
                    'options'      => array(),
                );
                $statuses = $this->getSourceStatuses();

                while ($statuses) {
                    $status = array_shift($statuses);
                    $wrapper = '';
                    $style = $this->getStyle(ifset($status['color'], 0));
                    if (!empty($style['title_color'])) {
                        $wrapper .= 'color: #'.$style['title_color'].';';
                    }
                    if (!empty($style['title_style_bold'])) {
                        $wrapper .= 'font-weight: bold;';
                    }
                    $option['options'][$status['id']] = array(
                        'name'    => sprintf('%s (%d)', $status['name'], ifempty($status['count'], 0)),
                        'wrapper' => $wrapper ? '<span style="'.$wrapper.'">%s</span>' : '%s',
                        'value'   => empty($status['count']) ? self::STATUS_IGNORE : null,
                    );
                }

                $this->addOption('status', $option);
            }
        } catch (Exception $ex) {
            $errors[''] = $ex->getMessage();
        }

        return parent::validate($result, $errors);
    }

    public function count()
    {
        $counts = array();

        $count_sqls = array(
            self::STAGE_PROJECT        => '`PROJECTWORK`',
            self::STAGE_TASK           => '`ISSUE`',
            self::STAGE_TASK_FILES     => "`ISSUE` WHERE `I_ATTACHMENT`!=''",
            self::STAGE_TASK_LOG_FILES => "`ISSUETRANSITIONLOG` WHERE `ITL_ATTACHMENT`!=''",
        );

        foreach ($count_sqls as $stage => $sqls) {
            if (!is_int($sqls)) {
                $counts[$stage] = 0;
                if (!is_array($sqls)) {
                    $sqls = $sqls ? array($sqls) : array();
                }
                foreach ($sqls as $sql) {
                    $query_result = $this->query("SELECT DISTINCT COUNT(1) AS `cnt` FROM {$sql}");
                    $counts[$stage] += intval($query_result['cnt']);
                }
            } else {
                $counts[$stage] = $sqls;
            }
        }

        return $counts;
    }

    public function step(&$current, &$count, &$processed, $stage, &$error)
    {
        $name = preg_replace_callback('@(^|_)([a-z])@', array(__CLASS__, 'camelCase'), $stage);
        $method_name = "step".$name;

        $result = false;
        try {
            if (method_exists($this, $method_name)) {
                /**
                 * @
                 */
                $result = $this->$method_name($current[$stage], $processed[$stage]);
                if ($result && ($processed[$stage] > 10) && ($current[$stage] == $count[$stage])) {
                    $this->log(sprintf("Break on count match %d for stage %s", $count[$stage], $stage), self::LOG_DEBUG);
                    $result = false;
                }
                if (!empty($processed[$stage]) && ($current[$stage] == $count[$stage])) {
                    $finish_method = "stepComplete".$name;
                    if (method_exists($this, $finish_method)) {
                        $this->$finish_method();
                    } else {
                        $this->log(sprintf("Skip unsupported complete method at stage [%s]", $stage), self::LOG_DEBUG);
                    }
                }
            } else {
                $this->log(sprintf("Skip unsupported stage [%s]", $stage), self::LOG_ERROR);
                $current[$stage] = $count[$stage];
            }
        } catch (Exception $ex) {
            $this->stepException($current, $stage, $error, $ex);
        }

        return $result;
    }

    /**
     * @param $current_stage
     * @param $processed
     * @return bool
     */
    private function stepProject(&$current_stage, &$processed)
    {
        static $project_data_cache = array();
        static $params = array();
        if (!isset($this->map[self::STAGE_PROJECT])) {
            $this->offset[self::STAGE_PROJECT] = '0:0';
            $this->map[self::STAGE_PROJECT] = array();
        }

        if (empty($params)) {
            $project_icons = $this->getConfig()->getOption('project_icons');
            $project_colors = $this->getConfig()->getOption('project_colors');
            $params['icon'] = reset($project_icons);
            $params['color'] = reset($project_colors);

        }
        if (!$project_data_cache) {
            $sql = <<<SQL
SELECT *
FROM `PROJECTWORK`
WHERE
(`P_ID` > %1\$d)
 OR
(
(`P_ID` = %1\$d)
AND
(
`PW_ID` > %2\$d
OR
`PW_ID` = 0
)
)
ORDER BY `P_ID`,`PW_ID` LIMIT 50
SQL;
            $offset = explode(':', $this->offset[self::STAGE_PROJECT]);
            $project_data_cache = $this->query($sql = sprintf($sql, $offset[0], $offset[1]), false);
        }
        $data = reset($project_data_cache);
        if ($data) {
            $original_id = sprintf('%d:%d', $data['P_ID'], $data['PW_ID']);
            $count_sql = 'SELECT COUNT(1) AS cnt FROM ISSUE WHERE P_ID=%d AND PW_ID=%d';
            $tasks_number = $this->query(sprintf($count_sql, $data['P_ID'], $data['PW_ID']));
            if ($tasks_number['cnt'] || !$this->getOption('skip_empty')) {

                $type = false;
                switch ($type) {
                    case 'w.name':
                        $name = sprintf('%d: %s', $data['PW_ID'], $data['PW_DESC']);
                        break;
                    case 'p.w.name':
                        $name = sprintf('%d.%d: %s', $data['P_ID'], $data['PW_ID'], $data['PW_DESC']);
                        break;
                    default:
                        $name = $data['PW_DESC'];
                        break;
                }

                $project = array(
                    'name'             => $name,
                    'contact_id'       => wa()->getUser()->getId(),
                    'create_datetime'  => $this->formatDatetime($data['PW_STARTDATE']),
                    'archive_datetime' => empty($data['PW_ENDDATE']) ? null : $this->formatDatetime($data['PW_ENDDATE']),
                    'icon'             => $params['icon'],
                    'color'            => $params['color'],
                    'tasks_number'     => $tasks_number['cnt'],
                );

                try {
                    if (
                        $this->getOption('skip_ended')
                        &&
                        $project['archive_datetime']
                        &&
                        (strtotime($project['archive_datetime']) < time())
                    ) {
                        $this->map[self::STAGE_PROJECT][$original_id] = -1;
                    } else {
                        $project['id'] = $this->project_model->insert($project, 1);
                        $this->map[self::STAGE_PROJECT][$original_id] = $project['id'];
                    }
                    ++$processed;
                } catch (Exception $ex) {
                    $this->log($ex->getMessage(), self::LOG_ERROR);
                }
            }

            $this->offset[self::STAGE_PROJECT] = $original_id;
            ++$current_stage;
            array_shift($project_data_cache);


        } else {
            $this->log(compact('offset', 'sql'));
        }

        return true;
    }

    /**
     * @param $current_stage
     * @param $processed
     * @return bool
     */
    private function stepTask(&$current_stage, &$processed)
    {
        static $task_data_cache = array();

        $result = false;

        if (!$current_stage) {
            $this->offset[self::STAGE_TASK] = 0;
            $this->map[self::STAGE_TASK_FILES] = array();
            $this->map[self::STAGE_TASK_LOG_FILES] = array();
            $this->map[self::STAGE_TASK] = $this->statusMap();
        }

        $status_map = &$this->map[self::STAGE_TASK];
        if (!$task_data_cache) {
            $sql = <<<SQL
SELECT *
FROM `ISSUE`
WHERE (`I_ID` > %d)
ORDER BY `I_ID`
LIMIT 50
SQL;
            $task_data_cache = $this->query(sprintf($sql, intval($this->offset[self::STAGE_TASK])), false);
            if ($task_data_cache) {
                $ids = array();
                foreach ($task_data_cache as &$data) {
                    $data['log'] = array();
                    $ids[intval($data['I_ID'])] = &$data['log'];
                    unset($data);
                }

                $sql = <<<SQL
SELECT *
FROM `ISSUETRANSITIONLOG`
WHERE (`I_ID` IN (%s))
ORDER BY `I_ID`, `ITL_ID`
SQL;
                if ($ids) {
                    $logs = $this->query(sprintf($sql, implode(',', array_keys($ids))), false);
                    while ($logs) {
                        $log = array_shift($logs);
                        $id = intval($log['I_ID']);
                        unset($log['I_ID']);
                        $ids[$id][] = $log;
                        unset($id);
                    }
                }
                unset($ids);
            }
        }

        $data = reset($task_data_cache);
        if ($data) {

            $original_id = intval($data['I_ID']);

            $status = mb_strtolower($data['I_STATUSCURRENT'], 'utf-8');

            if (!isset($status_map[$status])) {
                $this->log('Missed status id', self::LOG_ERROR, compact('data', 'status_map'));
            }

            $task = array(
                'name'                => '',
                'text'                => $data['I_DESC'],
                'contact_id'          => $this->getContact($data['U_ID_AUTHOR'], $data['U_ID_SENDER']),//OR U_ID_SENDER
                'create_datetime'     => $this->formatDatetime($data['I_STARTDATE']),
                'update_datetime'     => $this->formatDatetime($data['I_STARTDATE']),
                'assigned_contact_id' => $this->getContact($data['U_ID_ASSIGNED']),
                'project_id'          => ifset($this->map[self::STAGE_PROJECT][$data['P_ID'].':'.$data['PW_ID']], 0),
                'number'              => $data['I_NUM'],
                'status_id'           => ifset($status_map[$status], 0),
                'priority'            => $this->getPriority($data['I_PRIORITY']),
            );

            if (($task['status_id'] != self::STATUS_IGNORE) && ($task['project_id'] >= 0)) {

                $task['id'] = $this->task_model->insert($task, waModel::INSERT_IGNORE);

                if (!empty($data['I_ATTACHMENT'])) {
                    $this->map[self::STAGE_TASK_FILES][$original_id] = $task['id'];
                }

                //changelog
                if (!empty($data['log'])) {
                    $state = null;

                    $first = true;
                    $assigned_contact_id = $task['assigned_contact_id'];
                    $inserts = array();
                    foreach ($data['log'] as $log) {
                        $after_state = null;

                        if (!empty($log['ITL_STATUS'])) {
                            $status = mb_strtolower($log['ITL_STATUS'], 'utf-8');
                            $after_state = ifset($status_map[$status], $state);
                            if ($after_state == self::STATUS_IGNORE) {
                                $after_state = $state;
                            }
                        }

                        $insert = array(
                            'task_id'             => $task['id'],
                            'project_id'          => $task['project_id'],
                            'contact_id'          => $this->getContact($log['U_ID_SENDER']),
                            'text'                => $log['ITL_DESC'],
                            'create_datetime'     => $this->formatDatetime($log['ITL_DATETIME']),
                            'before_status_id'    => $state,
                            'after_status_id'     => $after_state,
                            'action'              => '',
                            'assigned_contact_id' => $this->getContact($log['U_ID_ASSIGNED']),
                        );

                        if ($first) {
                            $insert['action'] = 'create';
                            $first = false;
                        } else {
                            if (!empty($log['ITL_OLDCONTENT'])) {
                                $insert['action'] = 'edit';
                                $insert['text'] = $log['ITL_OLDCONTENT'];
                            } elseif ($state == $after_state) {
                                if ($assigned_contact_id == $insert['assigned_contact_id']) {
                                    $insert['action'] = 'comment';
                                } else {
                                    $insert['action'] = 'edit';
                                }
                            }
                        }

                        $inserts[] = $insert;
                        $state = $after_state;

                        $insert['id'] = $this->task_log_model->insert($insert);
                        if (!empty($log['ITL_ATTACHMENT'])) {
                            if (!isset($this->map[self::STAGE_TASK_LOG_FILES][$original_id])) {
                                $this->map[self::STAGE_TASK_LOG_FILES][$original_id] = array(
                                    'task_id' => $task['id'],
                                    'P_ID'    => $data['P_ID'],
                                    'PW_ID'   => $data['PW_ID'],
                                );
                            }
                            $this->map[self::STAGE_TASK_LOG_FILES][$original_id][(int)$log['ITL_ID']] = (int)$insert['id'];
                        }

                    }
                }
                ++$processed;
            } else {
                $this->log('Task skipped', self::LOG_INFO, $task);
            }
            $this->offset[self::STAGE_TASK] = $original_id;
            $result = true;
            array_shift($task_data_cache);
            ++$current_stage;

        }

        return $result;
    }

    private function stepCompleteTask()
    {
        $ids = array_values(array_unique(array_map('intval', $this->map[self::STAGE_PROJECT])));
        if ($ids) {
            $expr = <<<SQL
(
  SELECT IFNULL(MAX(number), 0)
  FROM tasks_task
  WHERE tasks_task.project_id = tasks_project.id
)
SQL;
            $this->project_model->updateById(
                $ids,
                array(
                    'tasks_number' => new waModelExpr($expr)
                )
            );
        }
    }

    protected function stepTaskFiles(&$current_stage, &$processed)
    {
        static $task_data_cache;
        $result = false;
        if (!$current_stage) {
            $this->offset[self::STAGE_TASK_FILES] = 0;
        }
        if (!$task_data_cache) {
            $sql = <<<SQL
SELECT
  I_ID,
  P_ID,
  PW_ID,
  I_ATTACHMENT,
  U_ID_AUTHOR
FROM `ISSUE`
WHERE
  (`I_ID` > %d)
  AND
  (`I_ATTACHMENT`!='')
ORDER BY `I_ID`
LIMIT 50
SQL;
            $task_data_cache = $this->query(sprintf($sql, intval($this->offset[self::STAGE_TASK_FILES])), false);
        }

        $pattern = "attachments/%s/%s/%s/";
        $task_data = reset($task_data_cache);
        if ($task_data) {
            $task_id = intval($task_data['I_ID']);
            if (!empty($this->map[self::STAGE_TASK_FILES][$task_id])) {
                $task_data['id'] = $this->map[self::STAGE_TASK_FILES][$task_id];
                try {
                    $files = $this->getFiles($task_data['I_ATTACHMENT']);
                    $task_path = sprintf($pattern, $task_data['P_ID'], $task_data['PW_ID'], $task_data['I_ID']);
                    if (empty($files)) {
                        $this->log('Empty files list', self::LOG_WARNING, $task_data);
                    }
                    foreach ($files as $file) {
                        $attach = array(
                            'task_id'         => $task_data['id'],
                            'log_id'          => null,
                            'create_datetime' => $this->formatDatetime($file['timestamp']),
                            'contact_id'      => $this->getContact($task_data['U_ID_AUTHOR']),
                            'size'            => $file['size'],
                            'name'            => basename($file['name']),
                            'ext'             => pathinfo($file['name'], PATHINFO_EXTENSION),
                            'code'            => $this->attachment_model->generateCode(),
                        );

                        $file['full_path'] = $task_path.$file['path'];
                        $processed += $this->addFile($attach, $file);
                    }

                } catch (Exception $ex) {
                    $this->log($ex->getMessage(), self::LOG_ERROR);
                }
            } else {
                $this->log('empty map item at ', self::LOG_WARNING, $task_data);
            }
            ++$current_stage;
            array_shift($task_data_cache);
            $this->offset[self::STAGE_TASK_FILES] = $task_id;
            $result = true;
        } else {
            $this->log('cache empty', self::LOG_WARNING, __METHOD__);
        }
        return $result;
    }

    protected function stepTaskLogFiles(&$current_stage, &$processed)
    {
        static $cache;
        $result = false;
        if (!$current_stage) {
            $this->offset[self::STAGE_TASK_LOG_FILES] = '0:0';
        }
        if (!$cache) {
            $sql = <<<SQL
SELECT
  I_ID,
  ITL_ID,
  ITL_ATTACHMENT,
  U_ID_SENDER,
  ITL_DATETIME
FROM `ISSUETRANSITIONLOG`
WHERE
    (
      (`I_ID` > %1\$d)
      OR
      (
        (`I_ID` = %1\$d)
        AND
        (`ITL_ID` > %2\$d)
      )
    )
    AND
    (`ITL_ATTACHMENT`!='')
ORDER BY `I_ID`,`ITL_ID`
LIMIT 50
SQL;

            $offset = array_map('intval', explode(':', $this->offset[self::STAGE_TASK_LOG_FILES]));
            $cache = $this->query(sprintf($sql, $offset[0], $offset[1]), false);
        }

        $pattern = "it/attachments/%s/%s/%s/transitions/%s/";
        $raw = reset($cache);
        if ($raw) {
            $task_id = intval($raw['I_ID']);
            $log_id = intval($raw['ITL_ID']);
            if (!empty($this->map[self::STAGE_TASK_LOG_FILES][$task_id])) {
                $map = $this->map[self::STAGE_TASK_LOG_FILES][$task_id];
                $task_log_path = sprintf($pattern, $map['P_ID'], $map['PW_ID'], $raw['I_ID'], $log_id);
                try {
                    $files = $this->getFiles($raw['ITL_ATTACHMENT']);

                    if (empty($files)) {
                        $this->log('Empty files list', self::LOG_WARNING, $raw);
                    }
                    foreach ($files as $file) {
                        $attach = array(
                            'task_id'         => $map['task_id'],
                            'log_id'          => $map[$log_id],
                            'create_datetime' => $this->formatDatetime($file['timestamp']),
                            'contact_id'      => $this->getContact($raw['U_ID_SENDER']),
                            'size'            => $file['size'],
                            'name'            => basename($file['name']),
                            'ext'             => pathinfo($file['name'], PATHINFO_EXTENSION),
                            'code'            => $this->attachment_model->generateCode(),
                        );

                        $file['full_path'] = $task_log_path.$file['path'];

                        $processed += $this->addFile($attach, $file);
                    }

                } catch (Exception $ex) {
                    $this->log($ex->getMessage(), self::LOG_ERROR);
                }
            } else {
                $this->log('empty map item', self::LOG_WARNING, $raw);
            }
            ++$current_stage;
            array_shift($cache);
            $this->offset[self::STAGE_TASK_LOG_FILES] = sprintf('%d:%d', $task_id, $log_id);
            $result = true;
        } else {
            $this->log('cache empty', self::LOG_WARNING, __METHOD__);
        }
        return $result;
    }

    private function addFile($attach, $file)
    {
        $processed = 0;

        $attach['id'] = $this->attachment_model->insert($attach);
        $file_path = tasksHelper::getAttachPath($attach);
        try {
            $this->moveFile($file['full_path'], $file_path);
            $file_size = file_exists($file_path) ? filesize($file_path) : false;
            if (!$file_size || $file_size != $file['size']) {
                throw new waException(sprintf('Invalid file size: expected %d but get %d @todo add task id', $file['size'], $file_size));
            }
            $this->attachment_model->updateById($attach['id'], array('size' => $file_size));
            ++$processed;
        } catch (Exception $ex) {
            if (!empty($attach['id'])) {
                $this->attachment_model->deleteById($attach['id']);
            }
            waFiles::delete($file_path);
            $this->log($ex->getMessage(), self::LOG_WARNING, $attach);
        }
        return $processed;
    }

    private function statusMap()
    {
        $states = $this->getOption('status');
        $icons = $this->getConfig()->getStatusIcons();
        $statuses = $this->getSourceStatuses();
        if ($statuses) {
            $insert = array();
            foreach ($statuses as $status) {
                if (!empty($states[$status['id']])) {
                    if ($states[$status['id']] == self::STATUS_ADD) {
                        $insert[$status['id']] = array(
                            'name'        => $status['name'],
                            #TODO check this field & format action name
                            'action_name' => $status['name'],
                            'button'      => $status['name'],
                            'icon'        => reset($icons),
                            'params'      => $this->getStyle($status['color']),
                        );
                    }
                }
            }

            if ($insert) {
                $sort = $this->status_model->select('MAX( `sort`)')->fetchField();
                foreach ($insert as $id => $status) {
                    $status['sort'] = ++$sort;
                    $status_id = $this->status_model->insert($status);
                    foreach (array_filter($status['params']) as $name => $value) {
                        $this->status_params_model->insert(compact('status_id', 'name', 'value'));
                    }
                    $states[$id] = $status_id;
                }
                $this->setOption('status', $states);
            }

            $this->log('Status mapping for tasks import', self::LOG_INFO, compact('statuses', 'states', 'insert'));

        }
        return $states;
    }

    public function settingStatusControl($name, $params = array())
    {
        foreach ($params as $field => $param) {
            if (strpos($field, 'wrapper')) {
                unset($params[$field]);
            }
        }
        $control = '';
        if (!isset($params['value']) || !is_array($params['value'])) {
            $params['value'] = array();
        }

        waHtmlControl::addNamespace($params, $name);
        $control .= '<table class="zebra">';
        $params['description_wrapper'] = '%s';
        $params['title_wrapper'] = '%s';
        $params['control_wrapper'] = '<tr title="%3$s"><td>%1$s</td><td>&rarr;</td><td>%2$s</td></tr>';
        $params['size'] = 6;
        $states = $this->status_model->getAll($this->status_model->getTableId());
        $source_states = $params['options'];
        $params['options'] = array();

        $params['options'][self::STATUS_ADD] = array(
            'group' => _wp('Extra actions'),
            'value' => self::STATUS_ADD,
            'title' => _wp('Add as new task status'),
            'style' => 'color: green;',
        );
        $params['options'][self::STATUS_IGNORE] = array(
            'group' => _wp('Extra actions'),
            'value' => self::STATUS_IGNORE,
            'title' => _wp('Don\'t import'),
            'style' => 'color: red;',
        );

        foreach ($states as $id => $state) {
            $params['options'][$id] = $state['name'];
        }

        $params['options'] += array(
            -1 => _w('Complete'),
            0  => _w('New'),
        );

        $predefined = array(
            'complete'    => -1,
            'done'        => -1,
            'new'         => 0,
            'новое'       => 0,
            'выполнено'   => 0,
            'in progress' => 0,

        );
        foreach ($source_states as $id => $state) {
            $control_params = $params;
            if (!empty($state['value'])) {
                $control_params['value'] = $state['value'];
            } else {
                $id = trim(mb_strtolower($id, 'utf-8'));
                $control_params['value'] = isset($predefined[$id]) ? $predefined[$id] : null;
            }
            $control_params['title'] = $state['name'];
            if (!empty($state['wrapper'])) {
                $control_params['title_wrapper'] = $state['wrapper'];
            } else {
                $control_params['title_wrapper'] = '%s';
            }
            if (empty($control_params['value'])) {
                $control_params['value'] = self::findSimilar($control_params, null, array('similar' => true));
            }
            $control .= waHtmlControl::getControl(waHtmlControl::SELECT, $id, $control_params);
        }
        $control .= "</table>";
        $control .= "<br/>".sprintf(_wp('or configure it at <a href="%s">Tasks\' settings</a>'), '#/settings/');
        return $control;

    }

    protected function checkSourceTables()
    {
        $tables = array(
            'CONTACT',
            'ISSUE',
            'ISSUETRANSITIONLOG',
            'ISSUETRANSITIONSCHEMA',
            'PROJECTWORK',
            'WBS_USER',
        );
        $missed_tables = array();
        foreach ($tables as $table) {
            try {
                $this->query("SELECT 1 FROM {$table} LIMIT 1");
            } catch (Exception $ex) {
                $missed_tables[] = $table;
                $this->log($ex->getMessage(), self::LOG_ERROR);
            }
        }
        if ($missed_tables) {
            throw new waException(sprintf(_wp('There no required webasyst tables: %s'), implode(', ', $missed_tables)));
        }
    }

    private function getFiles($raw)
    {
        $files = array();
        libxml_clear_errors();
        $xml = @simplexml_load_string(base64_decode($raw));
        if ($xml) {
            foreach ($xml->xpath('/FILELIST/FILE') as $xml_file) {
                $file = array(
                    'file'      => base64_decode((string)$xml_file['FILENAME']),
                    'name'      => base64_decode((string)$xml_file['SCREENFILENAME']),
                    'size'      => (int)$xml_file['FILESIZE'],
                    'path'      => base64_decode((string)$xml_file['DISKFILENAME']),
                    'timestamp' => (int)$xml_file['FILEDATE'],
                );

                if (!preg_match('//u', $file['file'])) {
                    $file['file'] = iconv('windows-1251', 'utf-8', $file['file']);
                }

                if (!preg_match('//u', $file['name'])) {
                    $file['name'] = iconv('windows-1251', 'utf-8', $file['name']);
                }
                $files[] = $file;
            }
        } else {
            $this->log('Error while read XML', self::LOG_ERROR, array('message' => libxml_get_last_error(), 'raw' => $raw));
        }
        return $files;
    }

    private function getContact($user_id, $sender = null)
    {
        $user_id = (string)$user_id;
        if (empty($user_id)) {
            return null;
        }
        if ($user_id === '!sender!') {
            return $this->getContact($sender);
        } elseif ($user_id === 'NULL') {
            return null;
        }
        if (!isset($this->map[self::STAGE_CONTACT])) {
            $this->map[self::STAGE_CONTACT] = array();
        }
        $map = &$this->map[self::STAGE_CONTACT];

        if (!isset($map[$user_id])) {
            //try search by login
            $contact = waUser::getByLogin($user_id);
            if ($contact) {
                $map[$user_id] = $contact->getId();
                $this->log(__METHOD__.' founded by login', self::LOG_INFO, array($user_id, $map[$user_id]));
            } else {

                $sql = <<<SQL
SELECT C_EMAILADDRESS email, C_FIRSTNAME firstname, C_LASTNAME lastname
 FROM `WBS_USER`
 LEFT JOIN `CONTACT` ON `CONTACT`.`C_ID`=`WBS_USER`.`C_ID`
 WHERE `U_ID`='%s'

SQL;

                $data = $this->query(sprintf($sql, $user_id));

                if (!empty($data['email'])) {
                    #search by primary email
                    $model = new waContactEmailsModel();
                    $map[$user_id] = $model->getContactIdByEmail($data['email']);
                    if ($map[$user_id]) {
                        $this->log(__METHOD__.' founded by email', self::LOG_INFO, array($user_id, $map[$user_id], $data));
                    }
                } elseif (empty($data['firstname']) && empty($data['lastname'])) {
                    #search by name
                    $model = new waContactModel();
                    $contact_data = $model->getByField(array(
                        'firstname'     => $user_id,
                        'lastname'      => '',
                        'create_app_id' => 'tasks',
                        'create_method' => 'migrate',
                    ));
                    if ($contact_data) {
                        $map[$user_id] = $contact_data['id'];
                        $this->log(__METHOD__.' founded by name', self::LOG_INFO, array($user_id, $map[$user_id], $data));
                    }
                }
                if (empty($map[$user_id])) {
                    #or add as a new contact
                    $contact = new waContact();
                    $contact['firstname'] = ifset($data['firstname'], $user_id);
                    $contact['create_method'] = 'migrate';
                    if (!empty($data['lastname'])) {
                        $contact->set('lastname', $data['lastname']);
                    }
                    if (!empty($data['email'])) {
                        $contact->set('email', $data['email']);
                    }
                    $id = $contact->save();
                    if (is_array($id)) {
                        $this->log('Error while save contact', self::LOG_ERROR, compact('data', 'id'));
                    } else {
                        $map[$user_id] = $id;
                        $contact->addToCategory('tasks');
                        $this->log(__METHOD__.' added as new', self::LOG_INFO, array($user_id, $map[$user_id], $data));
                    }
                }
            }
        }
        return ifset($map[$user_id]);
    }

    private function getPriority($level)
    {
        static $min;
        static $max;
        if (empty($max)) {
            $priorities = $this->getConfig()->getOption('priorities');
            $values = array_keys($priorities);
            $max = max($values);
            $min = min($values);
        }

        return max($min, min($max, intval($level) - 1));
    }

    private function getStyle($color_id)
    {
        #constants from WebAsyst IT
        $it_styles = array(
            0  => array("A52A2A", 0,),
            1  => array("A52A2A", 1,),
            2  => array("006400", 0,),
            3  => array("006400", 1,),
            4  => array("000000", 0,),
            5  => array("000000", 1,),
            6  => array("666600", 0,),
            7  => array("666600", 1,),
            8  => array("0000FF", 0,),
            9  => array("0000FF", 1,),
            10 => array("FF0000", 0,),
            11 => array("FF0000", 1,),
        );
        return array_combine(array('title_color', 'title_style_bold' => null), ifset($it_styles[$color_id], array(null, null)));
    }

    private function getSourceStatuses()
    {
        $sql = <<<SQL
SELECT DISTINCT
  `ITS_STATUS` `name`,
  `ITS_COLOR` `color`,
   LOWER(`ITS_STATUS`) 'id'
   FROM `ISSUETRANSITIONSCHEMA`
   GROUP BY `name`
   ORDER BY `name`, `P_ID`,`PW_ID`
SQL;
        $statuses = $this->query($sql, false);
        $sql = <<<SQL
SELECT DISTINCT
   COUNT(`I_STATUSCURRENT`) 'cnt',
   LOWER(I_STATUSCURRENT) 'name'
   FROM `ISSUE`
   GROUP BY name
SQL;
        $rows = $this->query($sql, false);
        $counts = array();
        foreach ($rows as $row) {
            $counts[$row['name']] = $row['cnt'];
        }
        foreach ($statuses as &$state) {
            $state['count'] = ifset($counts[$state['id']], 0);
        }
        unset($state);
        return $statuses;
    }

    abstract protected function query($sql, $one = true);

    abstract protected function moveFile($path, $target);
}
