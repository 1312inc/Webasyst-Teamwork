<?php

final class tasksApiLogGetListHandler
{
    /**
     * @param tasksApiLogGetListRequest $request
     *
     * @return tasksApiLogGetListDto
     */
    public function getLogs(tasksApiLogGetListRequest $request): tasksApiLogGetListDto
    {
        $logs = tsks()->getModel('tasksTaskLog')
            ->getList(
                tasksTaskLogModelGetListOptionsDto::fromArray(
                    array_merge(
                        [
                            'start' => $request->getOffset(),
                            'limit' => $request->getLimit(),
                            'with_tasks' => true,
                            'for_contact' => wa()->getUser()
                        ],
                        $request->getFilters()
                    )
                ),
                $totalCount
            );

        $this->pluginHook($logs);
        $this->addStatusColors($logs);

        $count = count($logs);

        return new tasksApiLogGetListDto($totalCount, $count, $logs);
    }

    private function addStatusColors(array &$logs): void
    {
        $statuses = tasksHelper::getStatuses(null, false);

        // Prepare status info for JS
        foreach ($statuses as $sid => &$s) {
            if (!empty($s['params']['button_color'])) {
                $color = '#' . $s['params']['button_color'];
            } else {
                if ($s['id'] == -1) {
                    $color = '#77dd77'; // `done`
                } else {
                    $color = '#44aa44'; // `new`
                }
            }
            $s['color'] = $color;
        }

        foreach ($logs as &$l) {
            $l += [
                'before_status_color' => 'transparent',
                'after_status_color' => 'transparent',
            ];
            if (!empty($statuses[$l['before_status_id']])) {
                $l['before_status_color'] = $statuses[$l['before_status_id']]['color'];
            }
            if (!empty($statuses[$l['after_status_id']])) {
                $l['after_status_color'] = $statuses[$l['after_status_id']]['color'];
            }
        }
    }

    private function pluginHook(array &$logs): void
    {
        $logs_by_task = [];
        foreach ($logs as &$l) {
            $logs_by_task[$l['task_id']][$l['id']] =& $l;
        }
        unset($l);
        wa('tasks')->event('tasks_log', $logs_by_task);
    }
}
