<?php

class tasksMilestonesAddMethod extends tasksApiAbstractMethod
{
    protected $method = self::METHOD_POST;

    /**
     * @return tasksApiResponseInterface
     * @throws tasksAccessException
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     * @throws tasksException
     * @throws waException
     */
    public function run(): tasksApiResponseInterface
    {
        $dueDate = $this->post('due_date');
        if ($dueDate) {
            $dueDate = DateTimeImmutable::createFromFormat('Y-m-d', $dueDate);
            if (!$dueDate) {
                throw new tasksApiWrongParamException('due_date', "'Y-m-d' format please");
            }
        }

        $request = new tasksApiMilestoneAddRequest(
            $this->post('name', true),
            $this->post('description') ?? '',
            (int) $this->post('project_id', true),
            $dueDate
        );

        return new tasksApiMilestoneResponse((new tasksApiMilestoneAddHandler())->add($request));
    }
}
