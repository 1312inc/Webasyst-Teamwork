<?php

final class tasksApiTeamGetTopAssigneesResponse implements tasksApiResponseInterface
{
    /**
     * @var tasksApiContactDto
     */
    private $dtos;

    /**
     * @param array<array<string, mixed>> $users
     */
    public function __construct(array $users)
    {
        foreach ($users as $user) {
            $this->dtos[] = new tasksApiContactDto(
                (int) $user['id'],
                $user['name'],
                wa()->getConfig()->getHostUrl() . $user['photo_url']
            );
        }
    }

    public function getStatus(): int
    {
        return self::HTTP_OK;
    }

    public function getResponseBody()
    {
        return [
            'data' => $this->dtos,
        ];
    }
}
