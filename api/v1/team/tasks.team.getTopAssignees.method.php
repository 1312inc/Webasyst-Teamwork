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
        $request = new tasksApiTeamGetTopAssigneesRequest($this->get('project_id', false, self::CAST_INT));

        $users = (new tasksApiTeamGetTopAssigneesHandler())->getUsers($request);

        $list = [];
        foreach ($users as $user) {
            $list[] = new tasksApiTeammateDto(
                new tasksApiContactDto(
                    (int) $user['id'],
                    $user['name'],
                    wa()->getConfig()->getHostUrl() . $user['photo_url'],
                    wa()->getUser()->getId() == $user['id']
                ),
                $user['calendar_status']
                    ? new tasksApiContactStatusDto(
                    $user['calendar_status']->getName(),
                    $user['calendar_status']->getBgColor(),
                    $user['calendar_status']->getFontColor()
                ) : null
            );
        }

        return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, ['data' => $list]);
    }
}
