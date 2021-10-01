<?php

final class tasksApiTeamGetListHandler
{
    public function getUsers(): array
    {
        $users = (new tasksApiTeamGetTopAssigneesHandler())->getUsers(new tasksApiTeamGetTopAssigneesRequest(0,0));

        $list = [];
        foreach ($users as $user) {

        }

        return $users;
    }
}
