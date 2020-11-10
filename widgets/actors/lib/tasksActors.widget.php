<?php

class tasksActorsWidget extends waWidget
{
    public function defaultAction()
    {
        $this->display(array(
            'widget_id' => $this->id,
            'stats' => $this->getStats(),
            'widget_url' => $this->getStaticUrl(),
            'title' => $this->getSettings('title')
        ));
    }
    
    protected function getStats()
    {
        $limit = $this->getLimit();
        $offset = $this->getOffset();

        $stats = $this->getRawStats($offset, $limit);

        if (!$stats && $offset > 0) {   // if somehow page is empty, force to go to the first page
            $offset = 0;
            $stats = $this->getRawStats($offset, $limit);
        } elseif (count($stats) < $limit) { // it's last page, set offset to first page
            $offset = 0;
        } else {
            $offset += $limit;
        }

        $this->setOffset($offset);

        $max_count = $this->getMaxCount();

        foreach ($stats as &$item) {
            $item['contact'] = $this->getContactInfo($item['assigned_contact_id']);
            $item['total_loading'] = ($item['total_count'] / $max_count) * 100;
            $item['overdue_loading'] = ($item['overdue_count'] / $max_count) * 100;
            $item['relative_overdue_loading'] = ($item['overdue_count'] / $item['total_count']) * 100;
        }
        unset($item);
        
        return $stats;
    }

    protected function getContactInfo($id)
    {
        $contact = new waContact($id);

        $name = 'Unknown #' . $contact->getId();
        $photo_url = wa()->getRootUrl() . 'wa-content/img/userpic20.jpg';

        if ($contact->exists()) {
            $name = trim($contact->get('lastname') . ' ' . $contact->get('firstname'));
            $photo_url = $contact->getPhotoUrl($contact->getId(), $contact->get('photo'), 20);
        }

        return array(
            'id' => $contact->getId(),
            'name' => $name,
            'photo_url' =>  $photo_url
        );
    }

    protected function calcPercentages($count, $max_count)
    {
        return ($count / $max_count) * 100;
    }

    protected function getLimit()
    {
        return 7;
    }

    protected function getOffset()
    {
        $offset = (int)$this->getSettings('offset');
        $offset = $offset > 0 ? $offset : 0;
        return $offset;
    }

    protected function setOffset($offset)
    {
        $offset = (int)$offset;
        $offset = $offset > 0 ? $offset : 0;
        $this->setOneSettingValue('offset', $offset);
    }

    protected function setOneSettingValue($name, $value)
    {
        $settings = $this->getSettings();
        $settings[$name] = $value;
        $this->setSettings($settings);
    }

    protected function getMaxCount()
    {
        $cache = $this->getSettings('cache');
        $cache = is_array($cache) ? $cache : array();

        if (isset($cache['max_count']) && is_array($cache['max_count'])) {

            $time = $cache['max_count']['time'];
            $time = wa_is_int($time) ? $time : 0;

            $ttl = 60; // 3 min

            // cache is alive
            if ($time > 0 && (time() - $time < $ttl)) {

                // valid value
                if (isset($cache['max_count']) && wa_is_int($cache['max_count']['value'])) {

                    // cache hit
                    return $cache['max_count']['value'];
                }
            }
        }

        // cache miss - calculate again
        $value = $this->calcMaxCount();

        // write cache
        $cache['max_count'] = array(
            'value' => $value,
            'time' => time()
        );
        $this->setOneSettingValue('cache', $cache);

        // return value
        return $value;
    }

    protected function calcMaxCount()
    {
        $filter = $this->getSettings('filter');
        $stat = new tasksWidgetStat($filter);
        return $stat->calcMaxCount();
    }

    protected function getRawStats($offset, $limit)
    {
        $filter = $this->getSettings('filter');
        $stat = new tasksWidgetStat($filter);
        return $stat->getStat($offset, $limit);
    }

    protected function getProjectIds()
    {
        $projects = tasksHelper::getProjects('active');
        return waUtils::getFieldValues($projects, 'id');
    }

    public static function getCustomFilterControl($name, $params)
    {
        $root_dir = realpath(dirname(__FILE__) . '/../');
        $templates_dir = $root_dir . '/templates/';
        $template_path = $templates_dir . 'FilterControl.html';

        $model = new tasksMilestoneModel();
        $milestones = $model->select('*')
            ->where('closed=0')
            ->order('closed DESC, due_date')->fetchAll('id');

        $widget_id = $params['widget_id'];
        $widget = wa()->getWidget($widget_id);
        $widget_info = $widget->getInfo();

        $app_url = wa()->getAppStaticUrl('tasks', true);
        $js_url = $app_url . 'widgets/actors/js/filterControl.js?v=' . $widget_info['version'];

        return self::renderTemplate($template_path, array(
            'name' => $name,
            'params' => $params,
            'widget' => $widget_info,
            'projects' => tasksHelper::getProjects(),
            'scopes' => $milestones,
            'js_url' => $js_url
        ));
    }

    protected static function renderTemplate($template, $assign = array())
    {
        if (!file_exists($template)) {
            return '';
        }
        $view = wa()->getView();
        $old_vars = $view->getVars();
        $view->clearAllAssign();
        $view->assign($assign);
        $html = $view->fetch($template);
        $view->clearAllAssign();
        $view->assign($old_vars);
        return $html;
    }
}
