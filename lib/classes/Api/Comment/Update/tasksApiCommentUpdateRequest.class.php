<?php

final class tasksApiCommentUpdateRequest
{
    /**
     * @var int
     */
    private $commentId;

    /**
     * @var string
     */
    private $text;

    /**
     * @var string|null
     */
    private $filesHash;

    public function __construct(int $commentId, string $text, ?string $filesHash)
    {
        $this->commentId = $commentId;
        $this->text = $text;
        $this->filesHash = $filesHash;
    }

    public function getCommentId(): int
    {
        return $this->commentId;
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
