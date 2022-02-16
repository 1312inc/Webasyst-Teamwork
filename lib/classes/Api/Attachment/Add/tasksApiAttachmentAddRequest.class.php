<?php

final class tasksApiAttachmentAddRequest
{
    /**
     * @var string
     */
    private $hash;

    /**
     * @var int|null
     */
    private $task_id;

    /**
     * @var waRequestFile[]
     */
    private $files;

    public function __construct(string $hash, ?int $task_id, array $files)
    {
        $this->hash = $hash;
        $this->task_id = $task_id;
        if (empty($files)) {
            throw new tasksValidationException('No files');
        }

        $this->files = $files;
    }

    public function getHash(): string
    {
        return $this->hash;
    }

    public function getTaskId(): ?int
    {
        return $this->task_id;
    }

    /**
     * @return waRequestFile[]
     */
    public function getFiles(): array
    {
        return $this->files;
    }
}
