<?php

final class tasksTeamGetter
{
    private $contacts = null;

    /**
     * @var waContactRightsModel
     */
    private $rightsModel;

    /**
     * @var waContactModel
     */
    private $contactModel;

    /**
     * @var tasksTaskLogModel
     */
    private $logModel;

    /**
     * @var waAppTokensModel
     */
    private $appTokenModel;

    public function __construct()
    {
        $this->rightsModel = new waContactRightsModel();
        $this->contactModel = new waContactModel();
        $this->logModel = new tasksTaskLogModel();
        $this->appTokenModel = new waAppTokensModel();
    }

    public function getTeam(taskTeamGetterParamsDto $paramsDto): array
    {
        if ($paramsDto->getProjectId() || ($this->contacts === null)) {
            $data = [];
            $contact_ids = $this->rightsModel->getUsers('tasks',
                $paramsDto->getProjectId() ? 'project.' . $paramsDto->getProjectId() : 'backend');

            if ($contact_ids) {
                $data = $this->contactModel->getById($contact_ids);

                foreach ($data as $contact_id => $c) {
                    $data[$contact_id]['name'] = tasksHelper::formatName($c);
                    $data[$contact_id]['is_active'] = false;
                    $data[$contact_id]['calendar_status'] = null;
                    $data[$contact_id]['invited'] = null;
                }

                uasort(
                    $data,
                    static function ($a, $b) {
                        return strcmp($a["name"], $b["name"]);
                    }
                );

                $contact_ids = $this->logModel->getRelatedContactIds(wa()->getUser()->getId(),
                    $paramsDto->getProjectId());
                if ($contact_ids) {
                    $tmp = [];
                    foreach ($contact_ids as $contact_id) {
                        if (isset($data[$contact_id])) {
                            $tmp[$contact_id] = $data[$contact_id];
                            $tmp[$contact_id]['is_active'] = true;
                        }
                    }

                    uasort(
                        $tmp,
                        static function ($a, $b) {
                            return strcmp($a["name"], $b["name"]);
                        }
                    );

                    foreach ($data as $contact_id => $contact) {
                        if (!isset($tmp[$contact_id])) {
                            $tmp[$contact_id] = $contact;
                        }
                    }
                    $data = $tmp;
                }
            }
            if (!$paramsDto->getProjectId()) {
                $this->contacts = $data;
            }
        } else {
            $data = $this->contacts;
        }

        if (!$paramsDto->isWithDisabled()) {
            foreach ($data as $contact_id => $c) {
                if ($c['is_user'] == -1) {
                    unset($data[$contact_id]);
                }
            }
        }

        if ($paramsDto->isWithCalendarStatus()) {
            $statusService = new tasksTeammateStatusService();
            foreach ($data as $contact_id => $c) {
                $data[$contact_id]['calendar_status'] = $statusService->getForContactId(
                    $contact_id,
                    new DateTimeImmutable()
                );
            }
        }

        if ($paramsDto->isWithInvited()) {
            $invited = $this->appTokenModel->getByField('app_id' , 'team', true);
            $invitedContacts = array_combine(
                array_column($invited, 'contact_id'),
                array_column($invited, 'token')
            );
            foreach ($invitedContacts as $invitedContactId => $token) {
                if (!array_key_exists($invitedContactId, $data)) {
                    continue;
                }

                $data[$invitedContactId]['invited'] = waAppTokensModel::getLink($token);
            }
        }

        if ($paramsDto->isOnlyActive()) {
            $contact_ids = $this->logModel->getContactIds();
            $result = [];
            $user_id = wa()->getUser()->getId();
            foreach ($data as $contact_id => $c) {
                $inInvited = $paramsDto->isWithInvited() && $c['invited'] !== null;
                if ((in_array($contact_id, $contact_ids) && $contact_id != $user_id) || $inInvited) {
                    $result[$contact_id] = $c;
                }
            }

            // invited последние
            usort($result, static function (array $a, array $b) {
                return $a['invited'] === null ? -1 : 1;
            });

            return $result;
        }

        return $data;
    }
}
