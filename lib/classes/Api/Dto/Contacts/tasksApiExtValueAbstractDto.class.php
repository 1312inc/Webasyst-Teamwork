<?php

abstract class tasksApiExtValueAbstractDto implements JsonSerializable
{
    use tasksApiJsonSerializableTrait;

    /**
     * @var string
     */
    protected $ext;

    /**
     * @var string
     */
    protected $value;

    public function __construct(string $ext, string $value)
    {
        $this->ext = $ext;
        $this->value = $value;
    }

    /**
     * @return array<static>
     */
    public static function createCollectionFromArray(array $data): array
    {
        return array_map(
            static function ($datum) {
                return static::createFromArray($datum);
            },
            $data
        );
    }

    /**
     * @return static
     */
    abstract public static function createFromArray(array $data);
}
