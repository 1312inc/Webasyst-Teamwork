<?php

class tasksApiContactRightsDto implements JsonSerializable
{
    use tasksApiJsonSerializableTrait;

    /**
     * @var bool
     */
    private $is_admin = false;

    /**
     * @var bool
     */
    private $projects_full_all = false;

    /**
     * @var bool
     */
    private $projects_assigned_all = false;

    /**
     * @var array
     */
    private $projects_full = [];

    /**
     * @var array
     */
    private $projects_assigned = [];

    public function __construct(array $rights)
    {
        if (isset($rights['backend']) && $rights['backend'] > 1) {
            $this->is_admin = true;
            $this->projects_full_all = true;
            $this->projects_assigned_all = true;
        } else {
            foreach ($rights as $right => $value) {
                if (strpos($right, 'project') === 0) {
                    [$project, $id] = explode('.', $right);
                    switch ($value) {
                        case tasksRights::PROJECT_ACCESS_VIEW_ASSIGNED_TASKS:
                            if ($id === 'all') {
                                $this->projects_assigned_all = true;
                            } else {
                                $this->projects_assigned[] = (int) $id;
                            }
                            break;

                        case tasksRights::PROJECT_ACCESS_FULL:
                            if ($id === 'all') {
                                $this->projects_full_all = true;
                            } else {
                                $this->projects_full[] = (int) $id;
                            }
                            break;
                    }
                }
            }
        }
    }
}
