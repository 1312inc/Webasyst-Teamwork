<?php

final class tasksApiPushEnableHandler
{
    public function handle(tasksApiPushEnableRequest $enableRequest): bool
    {
        $pushClientModel = new tasksPushClientModel();

        $existingClient = $pushClientModel->getById($enableRequest->getClientId());
        if ($existingClient) {
            return true;
        }

        return (bool) $pushClientModel->insert([
            'contact_id' => $enableRequest->getContact()->getId(),
            'create_datetime' => date('Y-m-d H:i:s'),
            'api_token' => $enableRequest->getAccessToken(),
            'client_id' => $enableRequest->getClientId(),
        ]);
    }
}
