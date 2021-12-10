<?php
class tasksLogChartAction extends tasksLogAction
{
    public function execute()
    {
        // Get parameters from GET/POST
        list($start_date, $end_date, $group_by) = self::getTimeframeParams();

        $chart_data = self::getChartData($start_date, $end_date, $group_by);
        $this->view->assign(array(
            'chart_data' => $chart_data,
            'start_date' => $start_date,
            'end_date' => $end_date,
            'group_by' => $group_by,
        ));
    }

    protected static function getChartData($start_date, $end_date, $group_by)
    {
        // Fetch stats for the chart
        $task_log_model = new tasksTaskLogModel();
        $period_data = $task_log_model->getPeriodByDate(
            tasksTaskLogModelGetListOptionsDto::fromArray(
                [
                    'group_by' => $group_by,
                    'start_date' => $start_date,
                    'end_date' => $end_date,
                ] + self::getFilters()
            )
        );

        // Get statuses info: names and colors
        $status_ids = array();
        foreach($period_data as $sids) {
            $status_ids += $sids;
        }
        $statuses = tasksHelper::getStatuses(null, false);
        $statuses = array_intersect_key($statuses, $status_ids);

        // Prepare status info for JS
        $chart_data = array();
        foreach($statuses as $sid => $s) {
            if(!empty($s['params']['button_color'])) {
                $color = '#'.$s['params']['button_color'];
            } else if ($s['id'] == -1) {
                $color = '#77dd77'; // `done`
            } else {
                $color = '#44aa44'; // `new`
            }

            $chart_data[$sid] = array(
                'label' => htmlspecialchars($s['name']),
                'color' => $color,
                'data' => array(),
            );
        }

        // Loop over all dates of the period and gather $chart_data[*]['data']
        for ($ts = strtotime($start_date); $ts <= strtotime($end_date); $ts = strtotime(date('Y-m-d', $ts) . ' +1 day')) {
            if ($group_by == 'months') {
                $new_date = date('Y-m-01', $ts);
                if (ifset($date) == $new_date) {
                    continue;
                }
                $date = $new_date;
            } else {
                $date = date('Y-m-d', $ts);
            }
            $sids = ifset($period_data[$date], array());
            $header = self::getHeader($group_by, $ts);
            foreach($chart_data as $sid => &$data) {
                $data['data'][$date] = array(
                    'time' => $ts,
                    'header' => $header,
                    'color' => $data['color'],
                    'y' => ifset($period_data[$date][$sid], 0),
                );
            }
        }
        foreach($chart_data as $sid => &$data) {
            $data['data'] = array_values($data['data']);
        }

        return array_values($chart_data);
    }

    public static function getHeader($group_by, $reg_ts)
    {
        switch($group_by) {
            case 'months':
                return _ws(date('F', $reg_ts)).'&nbsp;'.date('Y', $reg_ts);
            case 'weeks':
                $row_header = '<span class="nowrap">'.wa_date('humandate', $reg_ts).' —</span><br>';
                $row_header .= '<span class="nowrap">'.wa_date('humandate', strtotime('+6 days', $reg_ts)).'</span>';
                return $row_header;
            default:
                return '<span class="nowrap">'.wa_date('humandate', $reg_ts).'</span>';
        }
    }

    public static function getTimeframeParams()
    {
        $timeframe = waRequest::request('timeframe');
        if ($timeframe === 'all') {
            $start_date = null;
            $end_date = null;
        } else if ($timeframe == 'custom') {
            $from = waRequest::request('from', 0, 'int');
            $start_date = $from ? date('Y-m-d', $from) : null;

            $to = waRequest::request('to', 0, 'int');
            $end_date = $to ? date('Y-m-d 23:59:59', $to) : null;
        } else {
            if (!wa_is_int($timeframe)) {
                $timeframe = 90;
            }
            $start_date = date('Y-m-d', time() - $timeframe*24*3600);
            $end_date = null;
        }

        $group_by = waRequest::request('groupby', 'days');
        if ($group_by !== 'months') {
            $group_by = 'days';
        }

        if (!$end_date) {
            $end_date = date('Y-m-d 23:59:59');
        }
        if (!$start_date) {
            $m = new tasksTaskLogModel();
            $start_date = $m->getMinDate();
        }
        return array($start_date, $end_date, $group_by);
    }

    private static function getFilters()
    {
        $result = [
            'project_id' => waRequest::request('project_id', null, 'int'),
            'contact_id' => waRequest::request('contact_id', null, 'int'),
            'milestone_id' => waRequest::request('milestone_id', null, 'int'),
        ];

        return array_filter($result, wa_lambda('$a', 'return !is_null($a);'));
    }
}
