<?php

class tasksTasksMilestoneDialogAction extends waViewAction
{
    public function execute()
    {
        $this->view->assign([
            'milestones' => $this->getMilestones(),
        ]);
    }

    private function getMilestones()
    {
        $milestones = (new tasksMilestoneModel())->getMilestonesWithOrder(false);
        $projects = tsks()->getEntityRepository(tasksProject::class)->getProjectsAsArray();
        $accessed_projects = (new tasksRights())->getAvailableProjectForContact(wa()->getUser());

        foreach ($milestones as $id => $milestone) {
            if (!isset($projects[$milestone['project_id']])) {
                unset($milestones[$id]);
                continue;
            }
            $milestones[$id]['project_access_full'] = $accessed_projects === true || in_array($milestone['project_id'], $accessed_projects[tasksRights::PROJECT_ACCESS_FULL]);
            $milestones[$id]['project'] = $projects[$milestone['project_id']];
        }

        return $milestones;
    }
}
