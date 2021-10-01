<?php

class tasksTeamGetListMethod extends tasksApiAbstractMethod
{
    public function run(): tasksApiResponseInterface
    {
        $users = (new tasksApiTeamGetTopAssigneesHandler())->getUsers(new tasksApiTeamGetTopAssigneesRequest(0, 0));

        $list = [];
        $logs = tsks()->getModel('tasksTaskLog')
            ->getLastByContactIds(array_column($users, 'id'));

        $statusService = new tasksTeammateStatusService();

        foreach ($users as $user) {
            $contact = new waContact($user['id']);

            $status = $statusService->getForContact($contact, new DateTimeImmutable());

            $list[] = new tasksApiTeammateDetailsDto(
                tasksApiContactDtoFactory::fromContact($contact),
                tasksApiTeammateContactInfoDtoFactory::createFromContact($contact),
                $status
                    ? new tasksApiContactStatusDto(
                    $status->getName(),
                    $status->getBgColor(),
                    $status->getFontColor()
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
