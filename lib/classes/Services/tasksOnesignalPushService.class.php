<?php

class tasksOnesignalPushService extends onesignalPush
{
    /**
     * @var tasksPushClientModel
     */
    private $tasksPushClientModel;

    protected $tasksApiToken;

    public function __construct(?string $tasksApiToken)
    {
        $this->tasksPushClientModel = new tasksPushClientModel();
        $this->tasksApiToken = $tasksApiToken;
    }

    public function getId(): string
    {
        return 'onesignal';
    }

    /**
     * @param array|int        $contact_id
     * @param tasksPushDataDto $data
     *
     * @return array
     * @throws waException
     */
    public function sendByContact($contact_id, $data): array
    {
        $requestData = $this->prepareRequestData($data->toArray());

        $clientIds = $this->tasksPushClientModel->getByField('contact_id', $contact_id);
        tasksLogger::debug('Send to client ids:');
        tasksLogger::debug($clientIds);

        $result = [];
        foreach ($clientIds as $clientId) {
            $push_data = $requestData;
            $push_data['include_player_ids'] = $clientId;
            $response = $this->request('notifications', $push_data, waNet::METHOD_POST);
            tasksLogger::debug($response);

            $result[] = $response;
        }

        return $result;
    }

    public function isEnabled(): bool
    {
        return !empty($this->tasksApiToken);
    }

    protected function getNet(): waNet
    {
        if ($this->net === null) {
            $options = ['format' => waNet::FORMAT_JSON];

            $custom_headers = [
                'timeout' => 7,
                'Authorization' => 'Basic ' . $this->tasksApiToken,
            ];

            $this->net = new waNet($options, $custom_headers);
        }

        return $this->net;
    }
}
