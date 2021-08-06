<?php

final class tasksApiStatusAddHandler
{
    public function add(tasksApiStatusAddRequest $addRequest): array
    {
        $statusModel = tsks()->getModel(tasksStatus::class);
        $statusParamsModel = tsks()->getModel('tasksStatusParams');

        $id = $statusModel->insert([
            'name' => $addRequest->getName(),
            'button' => $addRequest->getButton(),
            'sort' => $addRequest->getSort(),
            'icon' => $addRequest->getIcon(),
        ]);

        if (!$id) {
            throw new waAPIException('Error on save status');
        }

        $statusParams = [
            'allow_comment' => (int) $addRequest->getAllowComment(),
            'assign_user' => $addRequest->getAssignUser() ?: '',
            'allow_clear_assign' => (int) $addRequest->getAllowClearAssign(),
            'assign' => $addRequest->getAssign() ?: '',
            'title_color' => $addRequest->getTitleColor() ?: '',
            'button_color' => $addRequest->getButtonColor() ?: '',
        ];

        try {
            $statusParamsModel->set($id, $statusParams);
        } catch (waException $exception) {
            waLog::log(
                sprintf('Error on save status: %s. %s', $exception->getMessage(), $exception->getTraceAsString()),
                'tasks/error.log'
            );

            $statusModel->deleteById($id);

            throw new waAPIException($exception->getMessage());
        }

        $allStatuses = tasksHelper::getStatuses(null, false);

        return $allStatuses[$id];
    }
}
