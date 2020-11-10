<?php

/**
 * Class tasksMigrateWebasystsameTransport
 * @title WebAsyst Tasks & Projects (old version) on the same server on extra paths
 * @description Migrate works and tasks
 */
class tasksMigrateWebasystcustomTransport extends tasksMigrateWebasystTransport
{
    protected $sql_options;

    /**
     * @var waModel
     */
    protected $source;
    protected $source_path;
    protected $dbkey;

    protected function initOptions()
    {
        parent::initOptions();
        $option = array(
            'title'        => _wp('Path to folder with files'),
            'placeholder'  => wa()->getConfig()->getRootPath(),
            'value'        => '',
            'description'  => _wp('Path to folder with attachments of the WebAsyst (old version) Projects & Tasks'),
            'control_type' => waHtmlControl::INPUT,
        );
        $this->addOption('path', $option);

        $option = array(
            'title'        => _wp('MySQL host'),
            'value'        => 'localhost',
            'control_type' => waHtmlControl::INPUT,
        );
        $this->addOption('host', $option);

        $option = array(
            'title'        => _wp('MySQL user'),
            'value'        => 'root',
            'placeholder'  => 'mysql_user',
            'control_type' => waHtmlControl::INPUT,
        );
        $this->addOption('user', $option);

        $option = array(
            'title'        => _wp('MySQL password'),
            'placeholder'  => 'mysql_password',
            'control_type' => waHtmlControl::PASSWORD,
        );
        $this->addOption('password', $option);

        $option = array(
            'title'        => _wp('MySQL database'),
            'placeholder'  => 'WEBASYST',
            'control_type' => waHtmlControl::INPUT,
        );
        $this->addOption('database', $option);
    }

    public function validate($result, &$errors)
    {
        try {
            $this->checkSourceTables();
            $option = array(
                'readonly' => true,
                'valid'    => true,
            );
            $this->addOption('host', $option);
            $this->addOption('user', $option);
            $this->addOption('password', $option);
            $this->addOption('database', $option);
            $path = $this->getOption('path');
            if ($path) {
                if (file_exists($path) && is_dir($path)) {
                    $this->addOption('path', $option);
                } else {
                    $result = false;
                    $errors['path'] = 'Files path not found';
                }
            } else {
                $this->addOption('path', array('readonly' => true,));
            }
        } catch (waDbException $ex) {
            $result = false;
            switch ($ex->getCode()) {
                case '1146':
                    $errors['database'] = "Required tables not found:\n".$ex->getMessage();
                    break;
                case '1046':
                case '1049':
                    $errors['database'] = $ex->getMessage();
                    break;
                default:
                    $errors[''] = $ex->getMessage();
                    if (empty($errors[''])) {
                        $errors[''] = sprintf('Generic MySQL error #%d', $ex->getCode());
                    }
                    break;
            }
        } catch (waException $ex) {
            $result = false;
            $errors[''] = $ex->getMessage();
            if (empty($errors[''])) {
                $errors[''] = sprintf('Generic MySQL error #%d', $ex->getCode());
            }
            $this->addOption('path', array('readonly' => false));
        } catch (Exception $ex) {
            $result = false;
            $errors[''] = $ex->getMessage();

        }

        return parent::validate($result, $errors);
    }

    private function getSourceModel()
    {
        if (!$this->source) {
            $this->sql_options = array(
                'host'     => $this->getOption('host'),
                'user'     => $this->getOption('user'),
                'password' => $this->getOption('password'),
                'database' => $this->getOption('database'),
                'type'     => extension_loaded('mysql') ? 'mysql' : 'mysqli',
            );
            $this->source = new waModel($this->sql_options);
        }

        return $this->source;
    }

    public function init()
    {

    }

    protected function query($sql, $one = true)
    {
        try {
            $debug = array();
            $debug['sql'] = $sql;
            $q = $this->getSourceModel()->query($sql);

            if ($one) {
                $res = $q->fetch();
            } else {
                $res = $q->fetchAll();
            }
            $debug['result'] = $res;
            $this->log($debug, self::LOG_DEBUG);

            return $res;
        } catch (Exception $ex) {
            $debug['error'] = $ex->getMessage();
            $this->log($debug, self::LOG_ERROR);
            throw new waException($debug['error']);
        }
    }

    protected function moveFile($path, $target)
    {
        if (!$this->source_path) {
            $this->source_path = rtrim($this->getOption('path'), '\\/').'/';
        }
        waFiles::copy($this->source_path.$path, $target);
    }

    protected function stepTaskFiles(&$current_stage, &$processed)
    {
        if (!$this->getOption('path')) {
            ++$current_stage;
            return true;
        } else {
            return parent::stepTaskFiles($current_stage, $processed);
        }
    }

    protected function stepTaskLogFiles(&$current_stage, &$processed)
    {
        if (!$this->getOption('path')) {
            ++$current_stage;
            return true;
        } else {
            return parent::stepTaskFiles($current_stage, $processed);
        }
    }
}
