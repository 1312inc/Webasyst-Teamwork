<?php
/**
 * Project ordering page in settings
 */
class tasksSettingsOrderingAction extends waViewAction
{
    public function execute()
    {
        if (!wa()->getUser()->isAdmin('tasks')) {
            throw new waRightsException(_w('Access denied'));
        }

        $saved = false;
        if (waRequest::method() == 'post') {
            $project_ids = waRequest::post('project_ids', array(), 'array_int');

            $project_model = new tasksProjectModel();
            $project_model->exec('UPDATE tasks_project SET sort=0');

            $i = count($project_ids) + 1;
            foreach($project_ids as $id) {
                $project_model->updateById($id, array(
                    'sort' => $i,
                ));
                $i--;
            }

            $saved = true;
        }

        $this->view->assign(array(
            'saved' => $saved,
            'projects' => tsks()->getEntityRepository(tasksProject::class)
                ->getProjectsAsArray(tasksProjectRepository::GET_PROJECT_ACTIVE),
            'archive_projects' => tsks()->getEntityRepository(tasksProject::class)
                ->getProjectsAsArray(tasksProjectRepository::GET_PROJECT_ARCHIVE),
        ));
    }
}

