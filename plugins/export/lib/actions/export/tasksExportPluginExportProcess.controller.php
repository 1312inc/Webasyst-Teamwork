<?php

class tasksExportPluginExportProcessController extends waLongActionController
{
    /**
     * @var tasksExportPluginTasksExporter
     */
    protected $exporter;

    public function __construct()
    {
        if (!wa()->getUser()->isAdmin('tasks')) {
            throw new waRightsException('Access denied');
        }
    }

    /** Called only once when a new export is requested */
    protected function init() {
        $this->data = array(
            // Separator between fields
            'separator' => ';',

            // encoding for output
            'outputEncoding' => 'utf-8',

            // need include fields names
            'export_fields_name' => true,

            // not export empty columns flag
            'not_export_empty_columns' => false
        );

        $this->exporter = $this->getExporter(array(
            'hash' => $this->getHash(),
            'filters' => $this->getFilters(),
            'order' => $this->getOrder()
        ));
    }

    /**
     * @param $options
     * @return tasksExportPluginTasksExporter
     */
    protected function getExporter($options = array())
    {
        if ($this->exporter) {
            return $this->exporter;
        }
        $options = array_merge(array(
            'process_id' => $this->processId,
            'not_export_empty_columns' => $this->data['not_export_empty_columns'],
            'not_export_column_names' => !$this->data['export_fields_name'],
        ), $options);

        return $this->exporter = new tasksExportPluginTasksExporter($options);
    }

    protected function encodeString($string)
    {
        $outputEncoding = $this->data['outputEncoding'];
        if ($outputEncoding == 'utf-8') {
            return $string;
        }
        return @iconv('utf-8', $outputEncoding . '//IGNORE', $string);
    }

    protected function isDone() {
        return $this->getExporter()->isExportDone() &&
            $this->getExporter()->isExportResultGettingDone();
    }

    protected function step() {

        if ($this->isDone()) {
            return false;
        }

        $exporter = $this->getExporter();

        if (!$exporter->isExportDone()) {
            $exporter->exportChunk();
            return false;
        }

        if (!$exporter->isExportResultGettingDone()) {
            foreach ($exporter->getExportResultChunk() as $line) {
                foreach ($line as &$value) {
                    $value = $this->encodeString($value);
                }
                unset($value);
                fputcsv($this->fd, $line, $this->data['separator']);
            }
            return false;
        }

        return false;
    }

    /** Return some info from $this->data to user. Other class variables are not available. */
    protected function info() {
        echo json_encode(array(
            'processId' => $this->processId,
            'ready' => false,
        ));
    }


    /** Return file to browser */
    protected function finish($filename) {

        if (!$this->getRequest()->get('file') && !$this->getRequest()->post('file')) {
            // lost messenger
            echo json_encode(array(
                'processId' => $this->processId,
                'ready' => true,
            ));
            return false;
        }
        waFiles::readfile($filename, 'exported_tasks.csv', false);
        return true;
    }

    /**
     * @return string
     */
    protected function getHash()
    {
        return trim((string)$this->getRequest()->request('hash'));
    }

    protected function getFilters()
    {
        return trim((string)$this->getRequest()->request('filters'));
    }

    protected function getOrder()
    {
        return trim((string)$this->getRequest()->request('order'));
    }

}
