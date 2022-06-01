<?php

final class taskTeamInviteByEmail extends teamUserInvitingByEmail
{
    public function invite(): tasksInviteResultDto
    {
        $result = $this->createInvitationToken();
        if (!$result['status']) {
            return new tasksInviteResultDto(null, $result['details']['description'], null);
        }

        $token = $result['details']['token'];

        return new tasksInviteResultDto((int) $token['contact_id'], null, $token);
    }
}
