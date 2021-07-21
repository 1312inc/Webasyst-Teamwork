<?php

final class tasksPersister
{
    /**
     * @param tasksPersistableInterface $entity
     * @param array                     $fields
     * @param int                       $type
     *
     * @return bool
     * @throws waException
     */
    public function insert(
        tasksPersistableInterface $entity,
        $fields = [],
        $type = waModel::INSERT_ON_DUPLICATE_KEY_UPDATE
    ): bool {
        $model = tsks()->getModel(get_class($entity));
        $data = tsks()->getHydrator()->extract($entity, $fields, $model->getMetadata());

        unset($data[$model->getTableId()]);

        $id = $model->insert($data, $type);

        if ($id) {
            $entity->setId($id);

            return true;
        }

        return false;
    }

    /**
     * @param tasksPersistableInterface $entity
     *
     * @return bool
     */
    public function delete(tasksPersistableInterface $entity): bool
    {
        $model = tsks()->getModel(get_class($entity));

        return $model->deleteById($entity->getId());
    }

    /**
     * @param tasksPersistableInterface $entity
     * @param array                     $fields
     *
     * @return bool|waDbResultUpdate|null
     * @throws waException
     */
    public function update(tasksPersistableInterface $entity, $fields = [])
    {
        $model = tsks()->getModel(get_class($entity));
        $data = tsks()->getHydrator()->extract(
            $entity,
            $fields,
            $model->getMetadata()
        );

        unset($data[$model->getTableId()]);

        return $model->updateById($entity->getId(), $data);
    }

    /**
     * @param tasksPersistableInterface $entity
     * @param array                     $fields
     *
     * @return bool|waDbResultUpdate|null
     * @throws waException
     */
    public function save(tasksPersistableInterface $entity, $fields = [])
    {
        if ($entity->getId()) {
            return $this->update($entity, $fields);
        }

        return $this->insert($entity, $fields);
    }

}