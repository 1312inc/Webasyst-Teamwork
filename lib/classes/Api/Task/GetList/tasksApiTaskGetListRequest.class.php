<?php

final class tasksApiTaskGetListRequest
{
    /**
     * @var string
     */
    private $hash;

    /**
     * @var string
     */
    private $filters;

    /**
     * @var int
     */
    private $offset;

    /**
     * @var int
     */
    private $limit;

    /**
     * @var ?int
     */
    private $since;

    /**
     * @var string
     */
    private $order;

    /**
     * tasksApiGetListRequest constructor.
     *
     * @param string  $hash
     * @param ?string $filters
     * @param int     $offset
     * @param int     $limit
     * @param ?int    $since
     * @param ?string $order
     *
     * @throws tasksValidateException
     */
    public function __construct(string $hash, ?string $filters, int $offset, int $limit, ?int $since, ?string $order)
    {
        $this->hash = $hash;
        $this->filters = (string) $filters;

        if ($offset < 0) {
            throw new tasksValidateException('Offset must be 0 or positive');
        }
        $this->offset = $offset;

        if ($limit < 0) {
            throw new tasksValidateException('Limit must be 0 or positive');
        }
        $this->limit = $limit;

        if ($since < 0) {
            throw new tasksValidateException('Since must be 0 or positive');
        }
        $this->since = $since;

        $this->order = $order ?: tasksCollection::ORDER_PRIORITY;
        if (!in_array($this->order, tasksCollection::ORDER_LIST, true)) {
            throw new tasksValidateException('Wrong order value');
        }
    }

    public function getHash(): string
    {
        return $this->hash;
    }

    public function getFilters(): string
    {
        return $this->filters;
    }

    public function getOffset(): int
    {
        return $this->offset;
    }

    public function getLimit(): int
    {
        return $this->limit;
    }

    public function getSince(): ?int
    {
        return $this->since;
    }

    public function getOrder(): string
    {
        return $this->order;
    }
}
