<?php

class tasksWidgetQueryBuilder
{
    protected $select   = [];
    protected $from     = [];
    protected $joins    = [];
    protected $where;
    protected $bind_params;
    protected $limit    = [];
    protected $order_by = [];
    protected $group_by = [];

    public function select($field)
    {
        $this->select = func_get_args();

        return $this;
    }

    public function from($table, $alias = null)
    {
        $this->from = [$table, $alias];

        return $this;
    }

    public function addJoin($join, $left = false)
    {
        $this->joins[] = [$join, $left];

        return $this;
    }

    public function addWhere($where, $param_name = null, $param_value = null)
    {
        $this->where[] = $where;
        if ($param_name !== null) {
            $this->bind_params[$param_name] = $param_value;
        }

        return $this;
    }

    public function limit($offset, $limit)
    {
        $this->limit = [$offset, $limit];

        return $this;
    }

    public function orderBy($order_by)
    {
        $this->order_by = func_get_args();

        return $this;
    }

    public function groupBy($group_by)
    {
        $this->group_by = func_get_args();

        return $this;
    }

    public function getQuery()
    {
        $query = [];
        $this->applySelect($query);
        $this->applyFrom($query);
        $this->applyJoins($query);
        $this->applyWhere($query);
        $this->applyGroupBy($query);
        $this->applyOrderBy($query);
        $this->applyLimit($query);

        return implode(" ", $query);
    }

    public function getParams()
    {
        return $this->bind_params;
    }

    protected function applySelect(&$query)
    {
        $select = implode(',', $this->select);
        $query[] = "SELECT {$select}";
    }

    protected function applyFrom(&$query)
    {
        [$from, $alias] = $this->from;
        $from = "FROM {$from}";
        if ($alias !== null) {
            $from .= " AS {$alias}";
        }
        $query[] = $from;
    }

    protected function applyJoins(&$query)
    {
        foreach ($this->joins as $pack) {
            [$join, $left] = $pack;
            $query[] = ($left ? "LEFT " : "") . "JOIN {$join}";
        }
    }

    protected function applyWhere(&$query)
    {
        $where = $this->where;
        if (is_array($where)) {
            $where = implode(' AND ', $where);
        }
        $where = is_scalar($where) ? trim((string) $where) : '';
        if ($where !== '') {
            $query[] = "WHERE {$where}";
        }
    }

    protected function applyLimit(&$query)
    {
        $offset = ifset($this->limit[0]);
        $limit = ifset($this->limit[1]);

        $expr = [];

        if ($offset !== null) {
            $offset = (int) $offset;
            if ($offset >= 0) {
                $expr[] = $offset;
            }
        }

        if ($limit !== null) {
            $limit = (int) $limit;
            if ($limit >= 0) {
                $expr[] = $limit;
            }
        }

        if ($expr) {
            $expr = implode(',', $expr);
            $query[] = "LIMIT {$expr}";
        }
    }

    protected function applyOrderBy(&$query)
    {
        if ($this->order_by) {
            $order_by = implode(',', $this->order_by);
            $query[] = "ORDER BY {$order_by}";
        }
    }

    protected function applyGroupBy(&$query)
    {
        if ($this->group_by) {
            $this->group_by = implode(',', $this->group_by);
            $query[] = "GROUP BY {$this->group_by}";
        }
    }
}
