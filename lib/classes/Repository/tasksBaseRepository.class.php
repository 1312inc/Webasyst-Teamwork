<?php

/**
 * Class tasksBaseRepository
 */
class tasksBaseRepository implements tasksEntityRepositoryInterface
{
    const DEFAULT_LIMIT  = 30;
    const DEFAULT_OFFSET = 0;

    /**
     * @var string
     */
    protected $entity;

    /**
     * @var int|null
     */
    protected $limit;

    /**
     * @var int|null
     */
    protected $offset;

    /**
     * @var array
     */
    protected $cache = [];

    public function __construct(string $entity)
    {
        $this->entity = $entity;
    }

    public function getLimit(): ?int
    {
        return $this->limit;
    }

    public function getEntity(): string
    {
        return $this->entity;
    }

    public function setEntity(string $entity): self
    {
        $this->entity = $entity;

        return $this;
    }

    public function setLimit(?int $limit): self
    {
        $this->limit = $limit;

        return $this;
    }

    public function resetLimitAndOffset(): self
    {
        $this->limit = null;
        $this->offset = null;

        return $this;
    }

    public function getOffset(): ?int
    {
        return $this->offset;
    }

    public function setOffset(?int $offset): self
    {
        $this->offset = $offset;

        return $this;
    }

    /**
     * @return tasksModel
     */
    public function getModel()
    {
        return tsks()->getModel($this->getEntity());
    }

    /**
     * @param $id
     *
     * @return array|mixed
     */
    public function findById($id)
    {
        $cached = $this->getFromCache($id);
        if ($cached !== null) {
            return $cached;
        }

        $data = $this->getModel()->getById($id);
        if (!$data) {
            return null;
        }

        $all = false;

        if (is_array($id) && !is_array($this->getModel()->getTableId())) {
            $all = true;
        }

        $entities = $this->generateWithData($data, $all);

        if (!$all && $entities) {
            $this->cache($id, $entities);
        }

        return $entities;
    }

    /**
     * @param string|array $field
     * @param null         $value
     * @param bool         $all
     * @param bool         $limit
     *
     * @return tasksAbstractEntity[]|tasksAbstractEntity
     * @throws waException
     */
    public function findByFields($field, $value = null, $all = false, $limit = false)
    {
        if (is_array($field)) {
            $data = $this->getModel()->getByField($field, $all, $limit);
        } else {
            $data = $this->getModel()->getByField($field, $value, $all, $limit);
        }

        $objs = $this->generateWithData($data, $all);

        return $all ? ($objs ?: []) : $objs;
    }

    /**
     * @return tasksAbstractEntity[]|tasksAbstractEntity
     */
    public function findAll()
    {
        $data = $this->getModel()->getAll();

        return $this->generateWithData($data, true);
    }

    /**
     * @param waDbQuery|waDbResult $query
     * @param bool                 $all
     * @param null|string          $key
     * @param bool                 $normalize
     *
     * @return object[]|object
     */
    public function findByQuery($query, $all = true, $key = null, $normalize = false)
    {
        $data = $query->fetchAll($key, $normalize);

        if (!$all) {
            $data = reset($data);
        }

        return $this->generateWithData($data, $all);
    }

    /**
     * @param array $data
     * @param bool  $all
     *
     * @return array<tasksAbstractEntity>|tasksAbstractEntity|null
     */
    public function generateWithData(array $data, $all = false)
    {
        if (empty($data)) {
            return $all ? [] : null;
        }

        if ($all === false) {
            $data = [$data];
        }

        $objects = [];

        $factory = tsks()->getEntityFactory($this->entity);
        foreach ($data as $key => $datum) {
            $objects[$key] = $factory->createNewWithData($datum);
        }

        return !$all ? reset($objects) : $objects;
    }

    public function getCache(): array
    {
        return $this->cache;
    }

    public function setCache($cache): self
    {
        $this->cache = $cache;

        return $this;
    }

    public function save(tasksPersistableInterface $entity, ...$params): bool
    {
        return tsks()->getPersister()->save($entity);
    }

    public function delete(tasksPersistableInterface $entity, ...$params): bool
    {
        return tsks()->getPersister()->delete($entity);
    }

    /**
     * @return null|tasksAbstractEntity
     */
    protected function getFromCache(string $key)
    {
        return $this->cache[$this->entity][$key] ?? null;
    }

    /**
     * @param string|array $key
     * @param object       $entity
     */
    protected function cache($key, $entity): void
    {
        if (is_array($key)) {
            $key = implode('|', $key);
        }

        if (!isset($this->cache[$this->entity])) {
            $this->cache[$this->entity] = [];
        }

        $this->cache[$this->entity][$key] = $entity;
    }
}
