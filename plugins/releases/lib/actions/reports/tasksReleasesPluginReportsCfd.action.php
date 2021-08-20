<?php
/**
 * Cumulative Flow Diagram, накопительная диаграмма потока.
 *
 * Этот класс - модифицированная копипаста из tasksLogAction и tasksLogChartAction.
 */
class tasksReleasesPluginReportsCfdAction extends tasksLogAction
{
    public function execute()
    {
        if (wa()->whichUI('tasks') != '2.0') {
            // Может быть когда-нибудь сделать и в старых стилях?..
            throw new waException('Отчёты работают только в стилях 2.0');
        }

        // Get parameters from GET/POST
        list($start_date, $end_date, $group_by) = tasksLogChartAction::getTimeframeParams();

        $chart_data = self::getChartData($start_date, $end_date, $group_by);
        $this->view->assign(array(
            'filter_types' => self::getLogFilterTypes(),
            'filters' => self::getFilters() + [$start_date, $end_date, $group_by],
            'chart_data' => $chart_data,
            'start_date' => $start_date,
            'end_date' => $end_date,
            'group_by' => $group_by,
        ));
    }

    protected static function getChartData($start_date, $end_date, $group_by)
    {
        return []; // !!! TODO
    }

    protected static function getFilters()
    {
        $result = [
            'project_id' => waRequest::request('project_id', null, 'int'),
            'contact_id' => waRequest::request('contact_id', null, 'int'),
            'milestone_id' => waRequest::request('milestone_id', null, 'int'),
        ];

        return array_filter($result, wa_lambda('$a', 'return !is_null($a);'));
    }
}
