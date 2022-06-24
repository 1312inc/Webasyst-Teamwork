<?php

/**
 * @method tasksProjectModel getModel()
 */
class tasksProjectRepository extends tasksBaseRepository
{
    public const GET_PROJECT_ACTIVE           = 'active';
    public const GET_PROJECT_ARCHIVE          = 'archive';
    public const GET_PROJECT_MANAGED          = 'managed';
    public const GET_PROJECT_AVAILABLE        = 'available';
    public const GET_PROJECT_ACTIVE_AVAILABLE = 'active_available';
    public const GET_PROJECT_ALL              = 'all';

    private $projectArrayCache = [];

    /**
     * @param tasksProject|tasksPersistableInterface $project
     * @param mixed                                  ...$params
     *
     * @return bool
     */
    public function save(tasksPersistableInterface $project, ...$params): bool
    {
        if ($params) {
            [$statuses] = $params;
        }

        if (!parent::save($project)) {
            return false;
        }

        if (!empty($statuses)) {
            $project_statuses_model = tsks()->getModel('tasksProjectStatuses');
            $project_statuses_model->setStatuses($project->getId(), $statuses);
        }

        return true;
    }

    /**
     * @param tasksProject|tasksPersistableInterface $project
     * @param mixed                                  ...$params
     *
     * @return bool
     */
    public function delete(tasksPersistableInterface $project, ...$params): bool
    {
        if (!parent::delete($project, $params)) {
            return false;
        }

        // delete related data
        tsks()->getModel('tasksProjectStatuses')->deleteByField(['project_id' => $project->getId()]);
        tsks()->getModel('tasksProjectStatusParams')->deleteByField(['project_id' => $project->getId()]);

        return true;
    }

    /**
     * @param string $type active|archive|managed|available|active_available|all
     *
     * @return array
     */
    public function getProjectsAsArray(string $type = self::GET_PROJECT_ACTIVE_AVAILABLE): array
    {
        $all_projects = $this->projectArrayCache['all_projects'] ?? null;
        $related_projects = $this->projectArrayCache['related_projects'] ?? null;

        if ($all_projects === null) {
            $all_projects = $this->getModel()
                ->select('*')
                ->order('archive_datetime DESC, sort DESC, name')
                ->fetchAll('id');

            foreach ($all_projects as &$p) {
                $p = tasksHelper::extendIcon($p, $p['color'], 'tasks');
            }

            unset($p);
            $this->projectArrayCache['all_projects'] = $all_projects;
        }

        $projects = $all_projects;
        if ($type !== self::GET_PROJECT_ALL) {
            $is_admin = wa()->getUser()->isAdmin('tasks');
            if ($is_admin) {
                $is_available = array_fill_keys(array_keys($all_projects), 2);
            } else {
                $is_available = wa()->getUser()->getRights('tasks', 'project.%');
                if (!empty($is_available['all'])) {
                    $is_available = array_fill_keys(array_keys($all_projects), $is_available['all']);
                }
            }
            foreach ($projects as $id => $p) {
                $skip = empty($is_available[$id]);
                $skip = $skip || (in_array($type, [self::GET_PROJECT_ACTIVE, self::GET_PROJECT_ACTIVE_AVAILABLE], true)
                        && $p['archive_datetime']);
                $skip = $skip || ($type === self::GET_PROJECT_ARCHIVE && !$p['archive_datetime']);
                $skip = $skip || ($type === self::GET_PROJECT_MANAGED && ifset($is_available[$id], 0) < 2);
                $skip = $skip || (in_array($type, [self::GET_PROJECT_AVAILABLE, self::GET_PROJECT_ACTIVE_AVAILABLE], true)
                        && ifset($is_available[$id], 0) < 1);
                if ($skip) {
                    unset($projects[$id]);
                }
            }
        }
        if ($type !== self::GET_PROJECT_ARCHIVE) {
            // related project to top
            if ($related_projects === null) {
                $log_model = new tasksTaskLogModel();
                $related_projects = $log_model->getRelatedProjects(wa()->getUser()->getId());
                $this->projectArrayCache['related_projects'] = $related_projects;
            }
            $result = [];
            foreach ($related_projects as $id) {
                if (isset($projects[$id])) {
                    $result[$id] = $projects[$id];
                }
            }
            foreach ($projects as $id => $p) {
                if (!isset($result[$id])) {
                    $result[$id] = $p;
                }
            }

            return $result;
        }

        return $projects;
    }
}
