<?php

final class tasksApiHashCountDto implements JsonSerializable
{
    use tasksApiJsonSerializableTrait;

    /**
     * @var string
     */
    private $hash;

    /**
     * @var tasksApiCountsDto
     */
    private $counts;

    public function __construct(string $hash, tasksApiCountsDto $counts)
    {
        $this->hash = $hash;
        $this->counts = $counts;
    }
}
