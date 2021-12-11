<?php

class tasksMilestoneModel extends waModel
{
    protected $table = 'tasks_milestone';

    public function getMilestoneStatuses($milestone_id = null)
    {
        $statuses = tasksHelper::getStatuses();
        foreach($statuses as &$s) {
            if ($s['id'] == 0) {
                $s['sort'] = -100500;
                $s['bg_color'] = 'transparent';
            } else if ($s['id'] == -1) {
                $s['sort'] = 100500;
                $s['bg_color'] = '#09e';
            } else if (!empty($s['params']['title_color'])) {
                $s['bg_color'] = '#'.$s['params']['title_color'];
            } else {
                $s['bg_color'] = '#888';
            }
            $s['percent'] = 0;
        }
        unset($s);


        $where = "milestone_id IS NOT NULL";
        $where_params = array();
        if ($milestone_id !== null) {
            if (is_array($milestone_id) || is_scalar($milestone_id)) {
                $milestone_ids = tasksHelper::toIntArray($milestone_id);
                $milestone_ids = tasksHelper::dropNotPositive($milestone_ids);
                if (!$milestone_ids) {
                    $where = '0';
                } else {
                    $where_params['milestone_ids'] = $milestone_ids;
                    $where = "milestone_id IN (:milestone_ids)";
                }
            }
        }

        $sql = "SELECT milestone_id, status_id, count(*) as `count`
                FROM tasks_task
                WHERE {$where}
                GROUP BY milestone_id, status_id";

        $result = array();
        foreach($this->query($sql, $where_params) as $row) {
            if (!empty($statuses[$row['status_id']])) {
                $result[$row['milestone_id']][$row['status_id']] = $statuses[$row['status_id']];
                $result[$row['milestone_id']][$row['status_id']]['count'] = $row['count'];
            }
        }

        foreach($result as &$mstatuses) {
            uasort($mstatuses, 'tasksMilestoneModel::sortHelper');
            $total = 0;
            foreach($mstatuses as $s) {
                $total += $s['count'];
            }
            if ($total > 0) {
                foreach($mstatuses as &$s) {
                    $s['percent'] = $s['count'] * 100 / $total;
                }
                unset($s);
            }
        }

        if ($milestone_id !== null && is_scalar($milestone_id)) {
            $milestone_id = (int)$milestone_id;
            $result = isset($result[$milestone_id]) ? $result[$milestone_id] : array();
        }

        return $result;
    }

    public static function sortHelper($a, $b) {
        return (int)($a['sort'] < $b['sort']) - (int)($a['sort'] > $b['sort']);
    }

    /**
     * @param $milestones
     * @param array $options
     *   - 'extra' array - list of extra values to fetch for each milestone
     *     * supported values: 'project'
     * @return array|mixed|void
     */
    public static function workup(&$milestones, $options = array())
    {
        $options = is_array($options) ? $options : array();

        if (!is_array($milestones)) {
            return;
        }

        $is_single = false;
        if (isset($milestones['id'])) {
            $is_single = true;
            $milestones = array(
                $milestones['id'] => $milestones
            );
        }

        foreach ($milestones as &$milestone) {
            // view supplies (styles, properties, etc.)
            $milestone['view'] = array(
                'due_color_class' => '',
                'due_text' => ''
            );

            $milestone['days_left'] = '';
            if ($milestone['due_date']) {
                $milestone['days_left'] = tasksHelper::calcDatesDiffInDays($milestone['due_date'], 'today');
                $milestone['view']['due_text'] = tasksHelper::formatDueText($milestone['days_left']);
                $milestone['view']['due_color_class'] = tasksHelper::formatDueColor($milestone['days_left']);
            }
        }
        unset($milestone);

        $extra = array();
        if (isset($options['extra']) && (is_array($options['extra']) || is_scalar($options['extra']))) {
            $extra = (array)$options['extra'];
        }
        $extra = array_fill_keys($extra, true);

        if (!empty($extra['project'])) {

            $projects = tsks()->getEntityRepository(tasksProject::class)->getProjectsAsArray();
            $project_model = new tasksProjectModel();

            foreach ($milestones as &$milestone) {
                if (!empty($projects[$milestone['project_id']])) {
                    $milestone['project'] = $projects[$milestone['project_id']];
                } else if (wa()->getUser()->isAdmin('tasks')) {
                    $milestone['project'] = tasksHelper::extendIcon($project_model->getEmptyRow());
                    $milestone['project']['name'] = 'deleted project_id=' . $milestone['project_id'];
                } else {
                    unset($milestones[$milestone['id']]);
                    continue;
                }
            }
            unset($milestone);
        }

        return $is_single ? reset($milestones) : $milestones;
    }

    /**
     * Show first the red tasks, and without a period - the last
     *
     * @return array
     */
    public function getMilestonesWithOrder($withClosed = true)
    {
        $result = $this->select('*')
            ->order('closed DESC, IFNULL(due_date, \'9999-12-31 23:59:59\') ASC');

        if (!$withClosed) {
            $result->where('closed=0');
        }

        return $result->fetchAll('id');
    }
}

