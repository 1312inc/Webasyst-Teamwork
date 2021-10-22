<?php

/**
 * Class tasksFavoriteModel
 */
class tasksFavoriteModel extends waModel
{
    protected $table = 'tasks_favorite';
    protected $id    = ['contact_id', 'task_id'];

    /**
     * Add to favorites
     * changeFavorite($contact_id, $task_id, true)
     *
     * Remove from favorites
     * changeFavorite($contact_id, $task_id, false)
     *
     * @param int  $contact_id - contact id
     * @param int  $task_id    - task id
     * @param bool $value      - add to favorites or remove from favorites
     */
    public function changeFavorite($contact_id, $task_id, $value)
    {
        if ($value) {
            return $this->insert([
                'contact_id' => $contact_id,
                'task_id' => $task_id,
            ], self::INSERT_IGNORE);
        }

        return $this->deleteByField(['contact_id' => $contact_id, 'task_id' => $task_id]);
    }
}