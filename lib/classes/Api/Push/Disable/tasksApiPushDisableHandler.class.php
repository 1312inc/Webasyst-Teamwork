<?php

final class tasksApiPushDisableHandler
{
    public function handle(tasksApiPushDisableRequest $disableRequest): bool
    {
        return (bool) (new tasksPushClientModel())->deleteById($disableRequest->getClientId());
    }
}
