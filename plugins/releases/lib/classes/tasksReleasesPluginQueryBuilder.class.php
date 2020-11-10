<?php

class tasksReleasesPluginQueryBuilder
{
    protected $select = array();
    protected $from = array();
    protected $joins = array();
    protected $where;
    protected $bind_params;
    protected $limit = array();
    protected $order_by = array();
    protected $group_by = array();

    public function select($field)
    {
        $this->select = func_get_args();
        return $this;
    }

    public function from($table, $alias = null)
    {
        $this->from = array($table, $alias);
        return $this;
    }

    public function addJoin($table, $alias, $on, $left = false)
    {
        $this->joins[] = array($table, $alias, $on, $left);
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
        $this->limit = array($offset, $limit);
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
        $query = array();
        $this->applySelect($query);
        $this->applyFrom($query);
        $this->applyJoins($query);
        $this->applyWhere($query);
        $this->applyGroupBy($query);
        $this->applyOrderBy($query);
        $this->applyLimit($query);
        return join(" ", $query);
    }

    public function getParams()
    {
        return $this->bind_params;
    }

    protected function applySelect(&$query)
    {
        $select = join(',', $this->select);
        $query[] = "SELECT {$select}";
    }

    protected function applyFrom(&$query)
    {
        list($from, $alias) = $this->from;
        $from = "FROM {$from}";
        if ($alias !== null) {
            $from .= " AS {$alias}";
        }
        $query[] = $from;
    }

    protected function applyJoins(&$query)
    {
        foreach ($this->joins as $pack) {
            list($table, $alias, $on, $left) = $pack;
            $expr = "`{$table}` AS `{$alias}` ON {$on}";
            $query[] = ($left ? "LEFT " : "") . "JOIN {$expr}";
        }
    }

    protected function applyWhere(&$query)
    {
        $where = $this->where;
        if (is_array($where)) {
            $where = join(' AND ', $where);
        }
        $where = is_scalar($where) ? trim((string)$where) : '';
        if (strlen($where) > 0) {
            $query[] = "WHERE {$where}";
        }
    }

    protected function applyLimit(&$query)
    {
        $offset = ifset($this->limit[0]);
        $limit = ifset($this->limit[1]);

        $expr = array();

        if ($offset !== null) {
            $offset = (int)$offset;
            if ($offset >= 0) {
                $expr[] = $offset;
            }
        }

        if ($limit !== null) {
            $limit = (int)$limit;
            if ($limit >= 0) {
                $expr[] = $limit;
            }
        }
        if ($expr) {
            $expr = join(',', $expr);
            $query[] = "LIMIT {$expr}";
        }
    }

    protected function applyOrderBy(&$query)
    {
        if ($this->order_by) {
            $order_by = join(',', $this->order_by);
            $query[] = "ORDER BY {$order_by}";
        }
    }

    protected function applyGroupBy(&$query)
    {
        if ($this->group_by) {
            $this->group_by = join(',', $this->group_by);
            $query[] = "GROUP BY {$this->group_by}";
        }
    }
}
