<?php
/**
 * When user enters # in task editor, there's a search with dropdown.
 * It contains entities from different applications: tags from Tasks, deals from CRM, etc.
 * This controller implements the list inside the dropdown.
 * UI 2.0 only.
 */
class tasksTasksEntityAutocompleteController extends waJsonController
{
    const DEFAULT_LIMIT = 20;

    public function execute()
    {
        $limit = waRequest::request('limit', self::DEFAULT_LIMIT, 'int');
        $limit = min($limit, 50);
        $term = waRequest::request('term', '', 'string');

        // Tags are loaded separately because allow for an empty $term
        $result = $this->loadTags($term, $limit);

        if (strlen($term) && count($result) < $limit) {
            $result = array_merge($result, $this->loadAllEntities($term, $limit - count($result)));
            //$this->addDefaultMarkdownCode($result);
        }

        $this->response = $result;
    }

    protected function loadTags($term, $limit)
    {
        $tag_model = new tasksTagModel();
        $tags = $tag_model->getAutocomplete($term, $limit);
        $result = [];
        foreach($tags as $t) {
            $result[] = [
                'app_id' => 'tasks',
                'entity_type' => 'tag',
                'entity_image' => null,
                'entity_title' => $t,
                'entity_url' => null,
                //'markdown_code' => '#'.$t,
            ];
        }
        return $result;
    }

    protected function loadAllEntities($term, $limit)
    {
        $result = $this->loadTasks($term, $limit);

        $event_result = wa('tasks')->event('backend_entity_autocomplete', ref([
            'term' => $term,
            'limit' => $limit - count($result),
        ]));

        $apps_handled = [];
        foreach($event_result as $app_id => $list) {
            $apps_handled[$app_id] = true;
            foreach($list as $entity) {
                $result[] = $entity;
            }
        }

        if (!isset($apps_handled['crm'])) {
            $result = array_merge($result, $this->loadCrmEntities($term, $limit - count($result)));
        }

        if (!isset($apps_handled['shop'])) {
            $result = array_merge($result, $this->loadShopEntities($term, $limit - count($result)));
        }
        return $result;
    }

    protected function loadTasks($term, $limit)
    {
        if ($limit <= 0 || !preg_match('~^\d+\.\d+$~', $term)) {
            return [];
        }
        list($project_id, $task_number) = explode('.', $term);

        $task_model = new tasksTaskModel();
        $task = $task_model->getByField([
            'project_id' => $project_id,
            'number' => $task_number,
        ]);
        if (!$task) {
            return [];
        }

        return [[
            'app_id' => 'tasks',
            'entity_type' => 'task',
            'entity_image' => null,
            'entity_title' => $task['name'],
            'entity_url' => wa()->getAppUrl('tasks')."#/task/{$project_id}.{$task_number}/",
            //'markdown_code' => "#{$project_id}.{$task_number}",
        ]];
    }

    protected function loadCrmEntities($term, $limit)
    {
        if ($limit <= 0 || !wa()->appExists('crm') || !wa()->getUser()->getRights('crm', 'backend')) {
            return [];
        }

        $result = [];

        // Deal (by id)
        $result = array_merge($result, $this->loadCrmDealsById($term, $limit - count($result)));

        // Deal (by name)
        $result = array_merge($result, $this->loadCrmDealsByName($term, $limit - count($result)));

        // Contact (by name)
        $result = array_merge($result, $this->loadCrmContactsByName($term, $limit - count($result)));

        return $result;
    }

    protected function loadCrmDealsById($term, $limit)
    {
        if ($limit <= 0 || !wa_is_int($term)) {
            return [];
        }
        $deal = (new waModel())->query('SELECT id, name FROM crm_deal WHERE id=?', [$term])->fetchAssoc();
        if (!$deal) {
            return [];
        }
        return [[
            'app_id' => 'crm',
            'entity_type' => 'deal',
            'entity_image' => null,
            'entity_title' => $deal['name'],
            'entity_url' => wa()->getAppUrl('crm')."deal/{$deal['id']}/",
            //default 'markdown_code'
        ]];
    }

    protected function loadCrmDealsByName($term, $limit)
    {
        if ($limit <= 0) {
            return [];
        }

        $m = new waModel();
        $deals = $m->query('SELECT id, name FROM crm_deal WHERE name LIKE ? LIMIT '.((int)$limit), [
            '%'.str_replace(['%', '_'], ['\\%', '\\_'], $term).'%'
        ])->fetchAll();

        $result = [];
        foreach($deals as $deal) {
            $result[] = [
                'app_id' => 'crm',
                'entity_type' => 'deal',
                'entity_image' => null,
                'entity_title' => $deal['name'],
                'entity_url' => wa()->getAppUrl('crm')."deal/{$deal['id']}/",
                //default 'markdown_code'
            ];
        }

        return $result;
    }

    protected function loadCrmContactsByName($term, $limit)
    {
        if ($limit <= 0) {
            return [];
        }
        $m = new waModel();
        $contacts = $m->query('SELECT id, name, photo, is_company FROM wa_contact WHERE name LIKE ? LIMIT '.((int)$limit), [
            '%'.str_replace(['%', '_'], ['\\%', '\\_'], $term).'%'
        ])->fetchAll();

        $result = [];
        foreach($contacts as $c) {
            $result[] = [
                'app_id' => 'crm',
                'entity_type' => 'contact',
                'entity_image' => waContact::getPhotoUrl($c['id'], $c['photo'], null, null, ($c['is_company'] ? 'company' : 'person')),
                'entity_title' => $c['name'],
                'entity_url' => wa()->getAppUrl('crm')."contact/{$c['id']}/",
                //default 'markdown_code'
            ];
        }

        return $result;
    }

    protected function loadShopEntities($term, $limit)
    {
        if ($limit <= 0 || !wa()->appExists('shop') || !wa()->getUser()->getRights('shop', 'backend')) {
            return [];
        }

        wa('shop');
        $result = [];

        $getRow = function($o) {
            return [
                'app_id' => 'shop',
                'entity_type' => 'order',
                'entity_image' => null,
                'entity_title' => $o['id_encoded'],
                'entity_url' => wa()->getAppUrl('shop')."#/orders/id={$o['id']}/",
            ];
        };

        // order id?
        if (wa_is_int($term)) {
            $collection = new shopOrdersCollection('id/'.$term);
            $orders = $collection->getOrders('id', 0, 1);
            if ($orders) {
                $result[] = $getRow(reset($orders));
            }
        }

        // encoded order id?
        $collection = new shopOrdersCollection('search/id='.$term);
        $orders = $collection->getOrders('id', 0, 1);
        if ($orders) {
            $result[] = $getRow(reset($orders));
        }

        // product name?
        if ($limit > count($result)) {
            $collection = new shopProductsCollection('search/query='.$term);
            $products = $collection->getProducts('id,name', 0, $limit - count($result));
            foreach($products as $p) {
                $result[] = [
                    'app_id' => 'shop',
                    'entity_type' => 'product',
                    'entity_image' => null,
                    'entity_title' => $p['name'],
                    'entity_url' => wa()->getAppUrl('shop')."products/{$p['id']}/",
                ];
            }
        }

        return $result;
    }

    protected function addDefaultMarkdownCode(&$result)
    {
        foreach ($result as &$row) {
            if (!isset($row['markdown_code'])) {
                $title = str_replace('#', '', $row['entity_title']);
                $row['markdown_code'] = "[{$title}]({$row['entity_url']})";
            }
        }
        unset($row);
    }
}
