<?php

final class tasksApiStatusUpdateHandler
{
    public function update(tasksApiStatusUpdateRequest $updateRequest): array
    {
        $statusModel = tsks()->getModel(tasksStatus::class);
        $statusParamsModel = tsks()->getModel('tasksStatusParams');

        $status = $statusModel->getById($updateRequest->getId());
        if (!$status) {
            throw new tasksResourceNotFoundException(_w('Status not found'));
        }

        $statusModel->updateById($updateRequest->getId(), [
            'name' => $updateRequest->getName(),
            'button' => $updateRequest->getButton(),
            'sort' => $updateRequest->getSort(),
            'icon' => $updateRequest->getIcon(),
        ]);

        $statusParams = [
            'allow_comment' => (int) $updateRequest->getAllowComment(),
            'assign_user' => $updateRequest->getAssignUser() ?: '',
            'allow_clear_assign' => (int) $updateRequest->getAllowClearAssign(),
            'assign' => $updateRequest->getAssign() ?: '',
            'title_color' => $updateRequest->getTitleColor() ?: '',
            'button_color' => $updateRequest->getButtonColor() ?: '',
        ];

        $statusParamsModel->set($updateRequest->getId(), $statusParams);

        $allStatuses = tasksHelper::getStatuses(null, false);

        return $allStatuses[$updateRequest->getId()];
    }
}
