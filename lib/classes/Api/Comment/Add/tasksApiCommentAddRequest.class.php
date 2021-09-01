<?php

final class tasksApiCommentAddRequest
{
    /**
     * @var int
     */
    private $taskId;

    /**
     * @var string
     */
    private $text;

    /**
     * @var string|null
     */
    private $filesHash;

    public function __construct(int $taskId, string $text, ?string $filesHash)
    {
        $this->taskId = $taskId;
        $this->text = $text;
        $this->filesHash = $filesHash;
    }

    public function getTaskId(): int
    {
        return $this->taskId;
    }

    public function getText(): string
    {
        return $this->text;
    }

    public function getFilesHash(): ?string
    {
        return $this->filesHash;
    }
}
