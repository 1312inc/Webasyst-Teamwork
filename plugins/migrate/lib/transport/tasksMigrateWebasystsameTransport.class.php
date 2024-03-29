<?php

/**
 * Class tasksMigrateWebasystsameTransport
 * @title WebAsyst Tasks & Projects (old version) on the same server
 * @description Migrate works and tasks
 */
class tasksMigrateWebasystsameTransport extends tasksMigrateWebasystTransport
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
            'title'        => _wp('Path to folder'),
            'value'        => wa()->getConfig()->getRootPath(),
            'description'  => _wp('Path to folder of the WebAsyst (old version) installation'),
            'control_type' => waHtmlControl::INPUT,
        );
        $this->addOption('path', $option);
    }

    public function validate($result, &$errors)
    {
        try {
            $this->checkSourceTables();
            $option = array(
                'readonly' => true,
                'valid'    => true,
            );
            $this->addOption('path', $option);
        } catch (Exception $ex) {
            $result = false;
            $errors['path'] = $ex->getMessage();
            $this->addOption('path', array('readonly' => false));
        }

        return parent::validate($result, $errors);
    }

    private function getSourceModel()
    {
        if (!$this->source) {
            $this->source_path = rtrim($this->getOption('path'), '\\/').'/';
            if (!file_exists($this->source_path)) {
                throw new waException(sprintf(_wp('Invalid PATH %s'), $this->source_path));
            }
            if (!file_exists($this->source_path.'kernel/wbs.xml')) {
                throw new waException(sprintf(_wp('Invalid PATH %s'), $this->source_path));
            }

            /**
             *
             * @var SimpleXMLElement $wbs
             */
            $wbs = simplexml_load_file($this->source_path.'kernel/wbs.xml');
            $xpath_result = $wbs->xpath('/WBS/FRONTEND');
            if (!$xpath_result) {
                throw new waException(sprintf(_wp('Invalid PATH %s'), $this->source_path).' (Invalid XML file)');
            }
            $frontend = reset($xpath_result);
            $this->dbkey = $frontend['dbkey'];
            $dkey_path = $this->source_path.'dblist/'.$this->dbkey.'.xml';

            if (empty($this->dbkey) || !file_exists($dkey_path)) {
                throw new waException(sprintf(_wp('Invalid PATH %s'), $this->source_path).(' DBKEY XML file not found'));
            }
            $dblist = simplexml_load_file($dkey_path);
            /**
             *
             * @var SimpleXMLElement $dblist
             */

            $host_name = (string)$dblist->{'DBSETTINGS'}['SQLSERVER'];
            $host = $wbs->xpath('/WBS/SQLSERVERS/SQLSERVER[@NAME="'.htmlentities($host_name, ENT_QUOTES, 'utf-8').'"]');
            if (!count($host)) {
                throw new waException(_wp('Invalid SQL server name'));
            }
            $host = $host[0];
            $port = (string)$host['PORT'];
            $this->sql_options = array(
                'host'     => (string)$host['HOST'].($port ? ':'.$port : ''),
                'user'     => (string)$dblist->{'DBSETTINGS'}['DB_USER'],
                'password' => (string)$dblist->{'DBSETTINGS'}['DB_PASSWORD'],
                'database' => (string)$dblist->{'DBSETTINGS'}['DB_NAME'],
                'type'     => extension_loaded('mysql') ? 'mysql' : 'mysqli',
                'charset'  => 'utf-8',
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
        $base_path = $this->source_path."data/{$this->dbkey}/attachments/it/";
        waFiles::copy($base_path.$path, $target);
    }
}
