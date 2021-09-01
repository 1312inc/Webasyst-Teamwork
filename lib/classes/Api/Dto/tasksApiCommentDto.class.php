<?php

final class tasksApiCommentDto implements JsonSerializable
{
    use tasksApiJsonSerializableTrait;

    /**
     * @var int
     */
    private $id;

    /**
     * @var string
     */
    private $text;

    /**
     * @var tasksApiAttachmentDto[]
     */
    private $attachments;

    public function __construct(int $id, string $text, array $attachments = [])
    {
        $this->id = $id;
        $this->text = $text;
        $this->attachments = $attachments;
    }
}
