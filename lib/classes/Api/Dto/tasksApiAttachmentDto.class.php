<?php

final class tasksApiAttachmentDto implements JsonSerializable
{
    use tasksApiJsonSerializableTrait;

    /**
     * @var int
     */
    private $id;

    /**
     * @var int|null
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
     * @var string
     */
    private $download_url;

    /**
     * @var bool
     */
    private $is_image;

    /**
     * @var string|null
     */
    private $preview_url;

    public function __construct(
        int $id,
        ?int $logId,
        string $createDatetime,
        tasksApiContactDto $contact,
        string $name,
        int $size,
        string $ext,
        string $code,
        string $downloadUrl,
        bool $isImage,
        ?string $previewUrl
    ) {
        $this->id = $id;
        $this->log_id = $logId;
        $this->create_datetime = $createDatetime;
        $this->contact = $contact;
        $this->name = $name;
        $this->size = $size;
        $this->ext = $ext;
        $this->code = $code;
        $this->download_url = $downloadUrl;
        $this->is_image = $isImage;
        $this->preview_url = $previewUrl;
    }
}