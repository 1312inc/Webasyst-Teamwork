<?php

class tasksTeamGetListMethod extends tasksApiAbstractMethod
{
    public function run(): tasksApiResponseInterface
    {
        $users = (new tasksApiTeamGetTopAssigneesHandler())->getUsers(new tasksApiTeamGetTopAssigneesRequest(null));

        $list = [];
        $logs = tsks()->getModel('tasksTaskLog')
            ->getLastByContactIds(array_column($users, 'id'));

        $taskIds = array_unique(array_column($logs, 'task_id'));
        $tasks = [];
        if ($taskIds) {
            $hash = 'id/' . implode(',', $taskIds);
            $collection = new tasksCollection($hash);
            $tasks = $collection->getTasks('*');
        }

        foreach ($logs as $i => $log) {
            if (!isset($tasks[$log['task_id']])) {
                continue;
            }

            $logs[$i]['task'] = new tasksTask($tasks[$log['task_id']]);
        }

        foreach ($users as $user) {
            if ($user['id'] == wa()->getUser()->getId()) {
                continue;
            }

            $contact = new waContact($user['id']);

            $list[] = new tasksApiTeammateDetailsDto(
                tasksApiContactDtoFactory::fromContact($contact),
                tasksApiTeammateContactInfoDtoFactory::createFromContact($contact),
                $user['calendar_status']
                    ? new tasksApiContactStatusDto(
                    $user['calendar_status']->getName(),
                    $user['calendar_status']->getBgColor(),
                    $user['calendar_status']->getFontColor()
                ) : null,
                isset($logs[$user['id']]) ? tasksApiLogDtoFactory::createFromArray($logs[$user['id']]) : null,
                (new waUserGroupsModel())->getGroups($contact->getId()) ?? []
            );
        }

        usort($list, static function (tasksApiTeammateDetailsDto $item1, tasksApiTeammateDetailsDto $item2) {
            if (!$item1->getLastLog()) {
                return 1;
            }

            if (!$item2->getLastLog()) {
                return -1;
            }

            return -($item1->getLastLog()->getId() <=> $item2->getLastLog()->getId());
        });

        return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, ['data' => $list]);
    }
}
