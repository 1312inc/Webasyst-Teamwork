<?php

/**
 * Class tasksMigrateTransport
 * @property-read tasksTaskModel $task_model
 * @property-read tasksTaskLogModel $task_log_model
 * @property-read tasksProjectModel $project_model
 * @property-read tasksStatusModel $status_model
 * @property-read tasksStatusParamsModel $status_params_model
 * @property-read tasksAttachmentModel $attachment_model
 */
abstract class tasksMigrateTransport implements Serializable
{
    const LOG_DEBUG = 5;
    const LOG_INFO = 4;
    const LOG_NOTICE = 3;
    const LOG_WARNING = 2;
    const LOG_ERROR = 1;

    private $temp_path;
    private $process_id = 'common';
    /**
     *
     * @var tasksConfig
     */
    private $wa;

    private $options = array();
    protected $map = array();
    protected $offset = array();

    const STAGE_PROJECT = 'project';
    const STAGE_TASK = 'task';
    const STAGE_TASK_FILES = 'task_files';
    const STAGE_TASK_LOG_FILES = 'task_log_files';
    const STAGE_CONTACT = 'contact';

    public function getStageName($stage)
    {
        $name = '';
        switch ($stage) {
            case self::STAGE_PROJECT:
                $name = _wp('Importing projects...');
                break;
            case self::STAGE_TASK:
                $name = _wp('Importing tasks...');
                break;
            case self::STAGE_TASK_FILES:
                $name = _wp('Importing files...');
                break;
            case self::STAGE_TASK_LOG_FILES:
                $name = _wp('Importing files...');
                break;
        }

        return $name;
    }

    public function getStageReport($stage, $data)
    {
        $report = '';
        if (!empty($data[$stage])) {
            $count = $data[$stage];
            switch ($stage) {
                case self::STAGE_PROJECT:
                    $report = _wp('%d project', '%d projects', $count);
                    break;
                case self::STAGE_TASK:
                    if (is_array($count)) {
                        foreach ($count as $action => $action_count) {
                            switch ($action) {
                                case 'skipped':
                                    $report = _wp('%d task skipped', '%d tasks skipped', $action_count);
                                    break;

                                case 'failed':
                                    $report = _wp('%d task failed', '%d tasks failed', $action_count);
                                    break;

                                default:
                                    $report = _wp('%d task', '%d tasks', $action_count);
                                    break;
                            }
                        }
                    } else {
                        $report = _wp('%d task', '%d tasks', $count);
                    }
                    break;
                case self::STAGE_TASK_FILES:
                    $report = _wp('%d task\'s file', '%d task\'s files', $count);
                    break;
                case self::STAGE_TASK_LOG_FILES:
                    $report = _wp('%d task comment\'s file', '%d task comment\'s files', $count);
                    break;
            }
        }

        return $report;
    }

    /**
     * Get migrate transport instance
     * @param string $id transport id
     * @param array $options
     * @param string $process_id
     * @throws waException
     * @return tasksMigrateTransport
     */
    public static function getTransport($id, $options = array(), $process_id = null)
    {
        $class = 'tasksMigrate'.ucfirst($id).'Transport';
        if ($id && class_exists($class)) {

            if (isset($options['transport'])) {
                unset($options['transport']);
            }
            /**
             * @var tasksMigrateTransport $transport
             */
            $transport = new $class($options, $process_id);
        } else {
            throw new waException('Transport not found');
        }
        if (!($transport instanceof self)) {
            throw new waException('Invalid transport');
        }

        return $transport;
    }

    protected function __construct($options = array(), $process_id = 'common')
    {
        $this->process_id = $process_id;
        $this->initOptions();
        foreach ($options as $k => $v) {
            $this->setOption($k, $v);
        }
    }

    public function __get($name)
    {
        static $models = array();
        if (preg_match('@^([a-z_]+)_model$@', $name, $matches)) {
            if (!isset($models[$matches[1]])) {
                $model = 'tasks'.preg_replace_callback('@(^|_)([a-z])@', array($this, 'camelCase'), $name);
                if (!class_exists($model)) {
                    throw new waException(sprintf('Model for %s not found', $matches[1]));
                }
                $models[$matches[1]] = new $model();
            }
            return $models[$matches[1]];
        }
        return null;
    }

    public function validate($result, &$errors)
    {
        if ($result) {
            $cached = null;
            $storage = null;
            foreach ($this->options as $name => $option) {
                if (!empty($option['cache'])) {
                    if (is_null($cached)) {
                        $storage = new waSessionStorage();
                        $cached = $storage->get($this->getStorageKey());
                        if (!is_array($cached)) {
                            $cached = array();
                        }
                    }
                    $cached[$name] = $this->getOption($name);
                }
            }
            if ($cached && $storage) {
                $storage->set($this->getStorageKey(), $cached);
            }
        }
        if ($errors) {
            $this->log('Validate errors', self::LOG_NOTICE, $errors);
        }
        return true && $result;
    }

    public function init()
    {

    }

    abstract public function step(&$current, &$count, &$processed, $stage, &$error);

    /**
     * @param array $current
     * @param string $stage
     * @param array $error
     * @param \Exception|\waException $ex
     * @throws Exception|waException
     */
    protected function stepException($current, $stage, &$error, Exception $ex)
    {
        sleep(5);
        $message = ifset($stage, 'unknown stage').': '.$ex->getMessage();
        $message .= (empty($error) ? ' @first' : ' @repeat');
        $message .= "\n".$ex->getTraceAsString();
        $this->log($message, self::LOG_ERROR);
        if (!empty($error)) {
            if (($error['stage'] == $stage)
                && ($error['iteration'] == $current[$stage])
                && ($error['code'] == $ex->getCode())
                && ($error['message'] == $ex->getMessage())
            ) {
                if (++$error['counter'] > 5) {
                    $this->log('BREAK ON '.$ex->getMessage(), self::LOG_ERROR);
                    throw $ex;
                }
            } else {
                $error = null;
            }
        }

        if (empty($error)) {
            $error = array(
                'stage'     => $stage,
                'iteration' => $current[$stage],
                'code'      => $ex->getCode(),
                'message'   => $ex->getMessage(),
                'counter'   => 0,

            );
        }
    }

    /**
     * @return string[string]
     */
    abstract public function count();

    private static function getLogLevelName($level)
    {
        $name = '';
        switch ($level) {
            case self::LOG_DEBUG:
                $name = 'Debug';
                break;
            case self::LOG_INFO:
                $name = 'Info';
                break;
            case self::LOG_NOTICE:
                $name = 'Notice';
                break;
            case self::LOG_WARNING:
                $name = 'Warning';
                break;
            case self::LOG_ERROR:
                $name = 'Error';
                break;
        }

        return $name;
    }

    protected function log($message, $level = self::LOG_WARNING, $data = null)
    {
        if (class_exists('waDebug')) {

        }
        if ($level <= $this->getOption('debug', self::LOG_WARNING)) {
            if (!is_string($message)) {
                $message = var_export($message, true);
            }
            if ($data) {
                if (!is_string($data)) {
                    $message .= "\n".var_export($data, true);
                } else {
                    $message .= "\n".$data;
                }
            }
            $path = sprintf('tasks/plugins/migrate/%s.log', get_class($this));
            waLog::log($this->process_id.': '.$this->getLogLevelName($level).': '.$message, $path);
        }
    }

    /**
     *
     * @param string $file_prefix
     * @return string
     */
    protected function getTempPath($file_prefix = null)
    {
        if (!$this->temp_path) {
            $this->temp_path = wa()->getTempPath('plugins/migrate/'.$this->process_id.'/', 'tasks');
            // waFiles::create($this->temp_path);
        }

        return ($file_prefix === null) ? $this->temp_path : tempnam($this->temp_path, $file_prefix);
    }

    /**
     *
     * @return tasksConfig
     */
    protected function getConfig()
    {
        if (!$this->wa) {
            $this->wa = wa()->getConfig();
        }

        return $this->wa;
    }

    public function restore()
    {
    }

    public function finish()
    {
        waFiles::delete($this->getTempPath(), true);
    }

    protected function initOptions()
    {
        if ($this->getConfig()->isDebug()) {
            $debug_levels = array(
                self::LOG_WARNING => _wp('Errors only'),
                self::LOG_DEBUG   => _wp('Debug (detailed log)'),
            );
            $option = array(
                'value'        => self::LOG_WARNING,
                'control_type' => waHtmlControl::SELECT,
                'title'        => _wp('Log level'),
                'options'      => array(),
            );
            $option['options'] = $debug_levels;
            $this->addOption('debug', $option);
        }
        waHtmlControl::registerControl('DatetimeControl', array(&$this, "settingDatetimeControl"));
    }

    protected function getOption($name, $default = null)
    {
        if (isset($this->options[$name]['value'])) {
            $value = $this->options[$name]['value'];
        } else {
            $value = $default;
        }

        return $value;
    }

    protected function getOptionSource($name)
    {
        return isset($this->options[$name]) ? $this->options[$name] : null;
    }

    protected function setOption($name, $value)
    {
        if (!isset($this->options[$name])) {
            $this->options[$name] = array(
                'control_type' => waHtmlControl::HIDDEN,
            );
        }
        $this->options[$name]['value'] = $value;
    }

    protected function addOption($name, $option = null)
    {
        if ($option) {
            if (!isset($this->options[$name])) {
                $this->options[$name] = array_merge(
                    array(
                        'control_type' => waHtmlControl::HIDDEN,
                        'value'        => null,
                    ),
                    $option
                );
            } else {
                $this->options[$name] = array_merge($this->options[$name], $option);
            }
        } elseif (is_array($name)) {
            foreach ($name as $_name => $option) {
                $this->addOption($_name, $option);
            }
        } elseif (isset($this->options[$name])) {
            unset($this->options[$name]);
        }
    }

    private function getStorageKey()
    {
        return 'tasks.migrate.'.preg_replace('@(^tasksMigrate|Transport$)@', '', get_class($this));
    }

    public function getControls($errors = array())
    {
        $controls = array();
        $cached = null;

        $params = array();
        $params['title_wrapper'] = '<div class="name">%s</div>';
        $params['description_wrapper'] = '<br><span class="hint">%s</span>';
        $params['control_separator'] = '</div><br><div class="value no-shift">';

        $params['control_wrapper'] = '
<div class="field">
%s
<div class="value no-shift">%s%s</div>
</div>';
        foreach ($this->options as $field => $properties) {
            if (!empty($properties['control_type'])) {
                if (!empty($errors[$field])) {
                    if (!isset($properties['class'])) {
                        $properties['class'] = array();
                    }
                    $properties['class'] = array_merge((array)$properties['class'], array('error'));
                    if (!isset($properties['description'])) {
                        $properties['description'] = '</span><span class="errormsg">';
                    } else {
                        $properties['description'] .= '</span><span class="errormsg">';
                    }
                    $properties['description'] .= $errors[$field];
                } elseif (!empty($properties['valid']) && !isset($properties['control_wrapper'])) {
                    $properties['control_wrapper'] = '
<div class="field">
%s
<div class="value no-shift">%s&nbsp;<i class="icon16 yes"></i>%s</div>
</div>';
                }
                if (!empty($properties['cache'])) {
                    if (is_null($cached)) {
                        $storage = new waSessionStorage();
                        $cached = $storage->get($this->getStorageKey());
                        if (!is_array($cached)) {
                            $cached = array();
                        }
                    }
                    if (!isset($properties['value']) || ($properties['value'] === null)) {
                        $properties['value'] = ifset($cached[$field]);
                    }

                }
                $control_params = array_merge($params, $properties);
                if (($properties['control_type'] == waHtmlControl::HIDDEN) && (empty($control_params['description']))) {
                    $control_params['control_wrapper'] = '
<div class="field" style="display: none;">
%s
<div class="value no-shift">%s%s</div>
</div>';
                }
                $controls[$field] = waHtmlControl::getControl($properties['control_type'], $field, $control_params);
            }
        }

        return $controls;
    }

    public function serialize()
    {
        $data = array();
        $data['map'] = $this->map;
        $data['offset'] = $this->offset;
        $data['options'] = array();
        $data['process_id'] = $this->process_id;
        foreach ($this->options as $name => & $option) {
            if (isset($option['value'])) {
                $data['options'][$name] = $option['value'];
            }
        }

        return serialize($data);
    }

    public function unserialize($serialized)
    {
        $data = unserialize($serialized);
        if (!empty($data['options'])) {
            foreach ($data['options'] as $name => $value) {
                $this->setOption($name, $value);
            }
        }
        if (!empty($data['map'])) {
            $this->map = $data['map'];
        }
        if (!empty($data['offset'])) {
            $this->offset = $data['offset'];
        }
        if (!empty($data['process_id'])) {
            $this->process_id = $data['process_id'];
        }

        return $this;
    }

    /**
     * @return string
     */
    protected function getContextDescription()
    {
        return '';
    }

    public static function enumerate()
    {
        $transports = array();
        $description = '';
        $dir = dirname(__FILE__);
        foreach (waFiles::listdir($dir) as $file) {
            if (($file != __FILE__) && preg_match('@^tasksMigrate(\w+)Transport\.class\.php@', $file, $matches)) {


                $value = strtolower($matches[1]);
                if (preg_match('@^webasyst(\w*)$@', $value, $matches)) {
                    $group = empty($matches[1]) ? null : 'Webasyst';
                } else {
                    $group = '3rdParty';
                }

                if ($group) {
                    $tokens = token_get_all(file_get_contents($dir.'/'.$file));
                    $doc = array();
                    while ($tokens) {
                        $token = array_shift($tokens);
                        if (is_array($token) && ($token[0] == T_DOC_COMMENT)) {
                            if (preg_match('~^/\*\*\n((.+\n){1,})\s*\*/$~', $token[1], $matches)) {
                                $raw = preg_split('~(^|\n)\s+\*\s+@~', $matches[1], -1, PREG_SPLIT_NO_EMPTY);
                                if ($raw) {
                                    foreach ($raw as $line) {
                                        $line = preg_split('@\s+@', $line, 2, PREG_SPLIT_NO_EMPTY);
                                        if (count($line) > 1) {
                                            $doc[$line[0]] = _wp(trim(end($line), "\n\r "));
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    }
                    $title = $value;
                    $transports[$value] = $doc + compact('file', 'group', 'title', 'description', 'value');
                }
            }
        }
        uasort($transports, array(__CLASS__, 'sort'));

        return $transports;
    }

    private static function sort($a, $b)
    {
        $sort = strcmp($b['group'], $a['group']);
        if ($sort == 0) {
            $sort = strcasecmp($a['title'], $b['title']);
        }
        return $sort;
    }

    protected function formatDatetime($utc)
    {
        return date('Y-m-d H:i:s', empty($utc) ? null : (is_int($utc) ? $utc : strtotime($utc)));
    }


    public static function settingDatetimeControl($name, $params = array())
    {
        waHtmlControl::addNamespace($params, $name);
        foreach ($params as $field => $param) {
            if (strpos($field, 'wrapper')) {
                unset($params[$field]);
            }
        }
        $params['title_wrapper'] = false;

        $params['options_wrapper']['description_wrapper'] = false;

        end($params['options']);
        $datetime = key($params['options']);
        $option = &$params['options'][$datetime];
        if (!is_array($option)) {
            $option = array(
                'value'       => $datetime,
                'description' => $option,
            );

        } elseif (!empty($option['value'])) {
            $datetime = $option['value'];
        } else {
            $option['value'] = $datetime;
        }
        $control_params = $params;
        foreach ($params as $field => $param) {
            if (strpos($field, 'wrapper')) {
                unset($control_params[$field]);
            }
        }
        $control_params['description_wrapper'] = false;
        $control_params['title_wrapper'] = false;
        $control_params['control_wrapper'] = '&nbsp;%2$s <a href = "#"><i class="icon16 calendar" ></i></a>';
        $control_params['value'] = date('Y - m - d', strtotime($datetime));
        $control_params['class'] = array_merge((array)ifset($control_params['class'], array()), array('small'));
        $control = waHtmlControl::getControl(waHtmlControl::RADIOGROUP, 'radio', $params);
        $control .= $params['control_separator'];
        $control .= waHtmlControl::getControl(waHtmlControl::INPUT, 'custom', $control_params);
        $today = date('Y - m - d');
        $selector = ifset($control_params['js - container'], '#plugin-migrate-transport-fields');
        $control .= <<<HTML
<script type="text/javascript">
(function ($) {
var container = $('{$selector}');
var datetime_input = container.find(':input[name*="{$name}"][name$="\\[custom\\]"]');
if(typeof($.datepicker) !='undefined'){
    datetime_input.datepicker({
        'dateFormat': 'yy-mm-dd',
        'numberOfMonths': 3,
        'maxDate': '{$today}'
    });
    datetime_input.next('a').click(function() {
        if(!datetime_input.attr('disabled')){
            datetime_input.datepicker('show');
        }
        return false;
    });
    // widget appears in bottom left corner for some reason, so we hide it
    datetime_input.datepicker('widget').hide();
} else {
    datetime_input.next('a').hide();
    console.error('jQuery plugin datepicker required');
}
container.find(':input[name*="{$name}"][name$="\\[radio\\]"]').change(function(){
   if(this.checked){
        if(this.value != '0'){
            datetime_input.attr('disabled',null);
            container.find('.js-goods').each(function(){
                $(this).parents('div.field').slideUp();

            })
        } else {
            datetime_input.attr('disabled',true);
            if(datetime_input.datepicker){
                datetime_input.datepicker('widget').hide();
            }
            container.find('.js-goods').each(function(){
                $(this).parents('div.field').slideDown();
            })
        }
    }
}).change();
setTimeout(function(){
    container.find(':input[name*="{$name}"]').change();
},100);
})(jQuery);
</script>
HTML;
        return $control;

    }


    protected static function findSimilar(&$params, $target = null, $options = array())
    {
        if ($target === null) {
            $target = empty($params['title']) ? ifset($params['description']) : $params['title'];
        }
        $selected = null;
        if ($target && empty($params['value'])) {
            $max = $p = 0;
            //init data structure
            foreach ($params['options'] as $id => & $column) {
                if (!is_array($column)) {
                    $column = array(
                        'title' => $column,
                        'value' => $id,
                    );
                }
                $column['like'] = 0;
            }

            if (!empty($options['similar'])) {
                foreach ($params['options'] as & $column) {
                    similar_text($column['title'], $target, $column['like']);
                    if ($column['like'] >= 90) {
                        $max = $column['like'];
                        $selected =& $column;
                    } else {
                        $column['like'] = 0;
                    }
                    unset($column);
                }
            }

            if ($max < 90) {
                unset($selected);
                $max = 0;
                $to = mb_strtolower($target);
                foreach ($params['options'] as & $column) {
                    if ($column['like'] < 90) {
                        $from = mb_strtolower($column['title']);
                        if ($from && $to && ((strpos($from, $to) === 0) || (strpos($to, $from) === 0))) {
                            $l_from = mb_strlen($from);
                            $l_to = mb_strlen($to);
                            $column['like'] = 100 * min($l_from, $l_to) / max($l_from, $l_to, 1);
                            if ($column['like'] > $max) {
                                $selected =& $column;
                                $max = $column['like'];
                            }
                        }
                    }
                    unset($column);
                }
            }

            if (!empty($selected)) {
                $selected['style'] = 'font-weight:bold;text-decoration:underline;';
                $params['value'] = $selected['value'];
            } elseif ((func_num_args() < 2) && !empty($params['title']) && !empty($params['description'])) {
                self::findSimilar($params, $params['description'], $options);
            }
        }

        return $params['value'];
    }

    protected static function dataMap(&$result, $data, $map)
    {
        foreach ($map as $field => $target) {
            if ($target && isset($data[$field])) {
                if (strpos($target, ':')) {
                    if (!empty($data[$field])) {
                        list($target, $sub_target) = explode(':', $target, 2);
                        if (empty($result[$target][$sub_target])) {
                            $result[$target][$sub_target] = '';
                        } else {
                            $result[$target][$sub_target] .= ' ';
                        }
                        $result[$target][$sub_target] .= $data[$field];
                    }
                } else {
                    $result[$target] = $data[$field];
                }
            }
        }
    }

    protected static function camelCase($m)
    {
        return strtoupper($m[2]);
    }
}
