<?php

final class tasksApiAttachmentDto implements JsonSerializable
{
    use tasksApiJsonSerializableTrait;

    /**
     * @var int
     */
    private $id;

    /**
     * @var ?int
     */
    private $log_id;

    /**
     * @var string
     */
    private $create_datetime;

    /**
     * @var tasksApiContactDto
     */
    private $contact;

    /**
     * @var string
     */
    private $name;

    /**
     * @var int
     */
    private $size;

    /**
     * @var string
     */
    private $ext;

    /**
     * @var string
     */
    private $code;

    /**
     * tasksApiAttachmentDto constructor.
     *
     * @param int                $id
     * @param int                $log_id
     * @param string             $create_datetime
     * @param tasksApiContactDto $contact
     * @param string             $name
     * @param int                $size
     * @param string             $ext
     * @param string             $code
     */
    public function __construct(
        int $id,
        ?int $log_id,
        string $create_datetime,
        tasksApiContactDto $contact,
        string $name,
        int $size,
        string $ext,
        string $code
    ) {
        $this->id = $id;
        $this->log_id = $log_id;
        $this->create_datetime = $create_datetime;
        $this->contact = $contact;
        $this->name = $name;
        $this->size = $size;
        $this->ext = $ext;
        $this->code = $code;
    }
}