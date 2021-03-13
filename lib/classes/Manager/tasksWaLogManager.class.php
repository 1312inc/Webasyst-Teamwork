<?php

class tasksWaLogManager
{
    private const LOG_ADD = 'task_add';

    public function lodAdd(tasksTask2 $task2): void
    {
        $this->logAction(self::LOG_ADD, $task2->getId());
    }

    /**
     * @param string   $action
     * @param mixed    $params
     * @param int|null $subject_contact_id
     * @param int|null $contact_id - actor contact id
     *
     * @return bool|int
     * @see \waController::logAction
     * Add record to table wa_log
     */
    public function logAction(
        string $action,
        $params = null,
        int $subject_contact_id = null,
        int $contact_id = null
    ) {
        try {
            if (!class_exists('waLogModel')) {
                wa('webasyst');
            }

            return tsks()->getModel('waLog')->add($action, $params, $subject_contact_id, $contact_id);
        } catch (Throwable $ex) {
            waLog::log($ex->getMessage(), 'tasks2.log');
        }

        return false;
    }
}