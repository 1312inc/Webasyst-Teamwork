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
     * @param int       $contact_id - contact id
     * @param int       $task_id    - task id
     * @param bool      $value      - add to favorites or remove from favorites
     * @param bool|null $unread     - change unread status
     */
    public function changeFavorite($contact_id, $task_id, $value, $unread=null)
    {
        if ($value) {
            if ($unread === null) {
                return $this->insert([
                    'contact_id' => $contact_id,
                    'task_id' => $task_id,
                ], self::INSERT_IGNORE);
            } else {
                return $this->insert([
                    'contact_id' => $contact_id,
                    'task_id' => $task_id,
                    'unread' => $unread ? 1 : 0,
                ], self::INSERT_ON_DUPLICATE_KEY_UPDATE);
            }
        }

        return $this->deleteByField(['contact_id' => $contact_id, 'task_id' => $task_id]);
    }

    public function markUnreadForContacts(array $contact_ids, int $task_id)
    {
        // INSERT ... ON DUPLICATE KEY UPDATE
        $this->multipleInsert([
            'contact_id' => $contact_ids,
            'task_id' => $task_id,
            'unread' => 1,
        ], ['unread']);
    }

    /**
     * @param int|array       $contact_id  one or several contacts
     * @param int|array|null  $task_id     one or several tasks or all tasks
     */
    public function markAsRead($contact_id, $task_id=null)
    {
        if (!$contact_id) {
            return;
        }
        $search = [
            'contact_id' => $contact_id,
        ];
        if ($task_id) {
            $search['task_id'] = $task_id;
        }

        $this->updateByField($search, ['unread' => 0]);
    }
}