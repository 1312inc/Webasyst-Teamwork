<?php

class tasksStatusesAddMethod extends tasksApiAbstractMethod
{
    protected $method = [self::METHOD_POST, self::METHOD_PUT];

    /**
     * @return tasksApiResponseInterface
     * @throws waRightsException
     */
    public function run(): tasksApiResponseInterface
    {
        if (!wa()->getUser()->isAdmin('tasks')) {
            throw new waRightsException(_w('Access denied'));
        }

        $request = new tasksApiStatusAddRequest(
            $this->post('name', true, self::CAST_STRING_TRIM),
            $this->post('button', true, self::CAST_STRING_TRIM),
            $this->post('icon', false, self::CAST_STRING_TRIM) ?: '',
            $this->post('assign_user', false, self::CAST_STRING_TRIM),
            $this->post('assign', false, self::CAST_ENUM, tasksStatusParamsModel::ASSIGN_TYPES),
            $this->post('allow_clear_assign', false, self::CAST_BOOLEAN),
            $this->post('button_color', false, self::CAST_STRING_TRIM),
            $this->post('title_color', false, self::CAST_STRING_TRIM),
            $this->post('allow_comment', false, self::CAST_BOOLEAN),
            $this->post('sort', false, self::CAST_INT) ?: 0
        );

        return new tasksApiStatusResponse((new tasksApiStatusAddHandler())->add($request));
    }
}
