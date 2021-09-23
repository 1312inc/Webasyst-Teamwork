<?php

final class tasksPushDataDto
{
    /**
     * @var string
     */
    private $title;

    /**
     * @var string
     */
    private $message;

    /**
     * @var string|null
     */
    private $url;

    /**
     * @var array
     */
    private $data;

    /**
     * @var string|null
     */
    private $imageUrl;

    public function __construct(string $title, string $message, ?string $url, ?array $data, ?string $imageUrl)
    {
        $this->title = $title;
        $this->message = $message;
        $this->url = $url;
        $this->data = $data ?? [1 => 1];
        $this->imageUrl = $imageUrl;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getMessage(): string
    {
        return $this->message;
    }

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function getData(): array
    {
        return $this->data;
    }

    public function getImageUrl(): ?string
    {
        return $this->imageUrl;
    }

    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'message' => $this->message,
            'url' => $this->url,
            'data' => $this->data,
            'image_url' => $this->imageUrl,
        ];
    }
}