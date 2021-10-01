<?php

class tasksTeamGetTopAssigneesMethod extends tasksApiAbstractMethod
{
    /**
     * @throws tasksApiMissingParamException
     * @throws waException
     * @throws tasksApiWrongParamException
     */
    public function run(): tasksApiResponseInterface
    {
        $request = new tasksApiTeamGetTopAssigneesRequest(
            $this->get('project_id', true, self::CAST_INT),
            $this->get('status_id', false, self::CAST_INT)
        );

        $users = (new tasksApiTeamGetTopAssigneesHandler())->getUsers($request);

        $statusService = new tasksTeammateStatusService();

        $list = [];
        foreach ($users as $user) {
            $contact = new waContact($user['id']);
            $status = $statusService->getForContact($contact, new DateTimeImmutable());

            $list[] = new tasksApiTeammateDto(
                new tasksApiContactDto(
                    (int) $user['id'],
                    $user['name'],
                    wa()->getConfig()->getHostUrl() . $user['photo_url'],
                    wa()->getUser()->getId() == $user['id']
                ),
                $status
                    ? new tasksApiContactStatusDto(
                    $status->getName(),
                    $status->getBgColor(),
                    $status->getFontColor()
                ) : null
            );
        }

        return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, ['data' => $list]);
    }
}
