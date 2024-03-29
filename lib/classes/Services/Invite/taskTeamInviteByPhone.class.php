<?php

final class taskTeamInviteByPhone extends teamUserInvitingByPhone
{
    public function invite(): tasksInviteResultDto
    {
        if (!(new waWebasystIDClientManager())->isConnected()) {
            return new tasksInviteResultDto(null, _w('Webasyst ID auth is required to be enabled to send an invitation'), null);
        }

        $result = $this->createInvitationToken();
        if (!$result['status']) {
            return new tasksInviteResultDto(null, $result['details']['description'], null);
        }

        $token = $result['details']['token'];

        return new tasksInviteResultDto((int) $token['contact_id'], null, $token);
    }
}
