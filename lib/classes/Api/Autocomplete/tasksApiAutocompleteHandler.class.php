<?php
/**
 * Autocomplete for @-mentions and #-hashtags used in web backend as well as API
 */
class tasksApiAutocompleteHandler
{
    protected $options;

    public function __construct(?array $options = null)
    {
        $this->options = ifset($options, []);
    }

    public function handle(string $term, int $limit): array
    {
        if ($term !== '') {
            switch ($term[0]) {
                case '@':
                    return $this->handleMention(substr($term, 1),  $limit);
                case '#':
                    return $this->handleHashtag(substr($term, 1),  $limit);
            }
        }
        return [];
    }

    protected function getPrettifier()
    {
        return new tasksLinksPrettifier([
            'absolute_urls' => !empty($this->options['absolute_urls']),
        ]);
    }

    protected function handleMention(string $term, int $limit)
    {
        $prettifier = $this->getPrettifier();
        $result = $this->loadUsers($prettifier, $term, $limit);

        return array_values($prettifier->getData());
    }

    protected function handleHashtag(string $term, int $limit)
    {
        $prettifier = $this->getPrettifier();

        // Tags are loaded separately because allow for an empty $term
        $this->loadTags($prettifier, $term, $limit);

        if (strlen($term) && $prettifier->count() < $limit) {
            $this->loadTasks($prettifier, $term, $limit);

            $event_result = wa('tasks')->event('backend_entity_autocomplete', ref([
                'term' => $term,
                'limit' => $limit - $prettifier->count(),
            ]));

            $apps_handled = [];
            foreach($event_result as $app_id => $list) {
                $apps_handled[$app_id] = true;
                foreach($list as $entity) {
                    $prettifier->addEntity($entity);
                }
            }

            if (!isset($apps_handled['crm'])) {
                $this->loadCrmEntities($prettifier, $term, $limit);
            }

            if (!isset($apps_handled['shop'])) {
                $this->loadShopEntities($prettifier, $term, $limit);
            }
        }

        return array_values($prettifier->getData());
    }

    protected function loadUsers($prettifier, $term, $limit)
    {
        $term = mb_strtolower($term);
        $users = (new tasksTeamGetter())->getTeam(new taskTeamGetterParamsDto(null, false));

        foreach($users as $u) {

            if (strlen($term)) {
                $data = join(' ', [
                    $u['name'],
                    $u['firstname'],
                    $u['middlename'],
                    $u['lastname'],
                    $u['login'],
                ]);
                if (strpos(mb_strtolower($data), $term) === false) {
                    continue;
                }
            }

            $prettifier->addMention($u);
        }
    }

    protected function loadTags($prettifier, $term, $limit)
    {
        $tag_model = new tasksTagModel();
        $tags = $tag_model->getAutocomplete($term, $limit);
        foreach($tags as $t) {
            $prettifier->addTag($t);
        }
    }

    protected function loadTasks($prettifier, $term, $limit)
    {
        if ($limit <= $prettifier->count() || !preg_match('~^\d+\.\d+$~', $term)) {
            return;
        }
        list($project_id, $task_number) = explode('.', $term);

        $task_model = new tasksTaskModel();
        $task = $task_model->getByField([
            'project_id' => $project_id,
            'number' => $task_number,
        ]);
        if ($task) {
            $prettifier->addTask($task);
        }

        $limit -= $prettifier->count();
        if ($limit <= 0) {
            return;
        }

        $sql = "SELECT id, project_id, number, name
                FROM tasks_task
                WHERE project_id=?
                    AND number > ?
                    AND number LIKE ?
                ORDER BY number
                LIMIT ".$limit;
        $rows = $task_model->query($sql, [
            $project_id,
            $task_number,
            $task_number.'%',
        ]);
        foreach($rows as $task) {
            $prettifier->addTask($task);
        }
    }

    protected function loadCrmEntities($prettifier, $term, $limit)
    {
        if ($limit <= $prettifier->count() || !wa()->appExists('crm') || !wa()->getUser()->getRights('crm', 'backend')) {
            return;
        }

        // Deal (by id)
        $this->loadCrmDealsById($prettifier, $term, $limit);

        // Deal (by name)
        $this->loadCrmDealsByName($prettifier, $term, $limit);

        // Contact (by name)
        $this->loadCrmContactsByName($prettifier, $term, $limit);
    }

    protected function loadCrmDealsById($prettifier, $term, $limit)
    {
        if ($limit <= $prettifier->count() || !wa_is_int($term)) {
            return;
        }
        $deal = (new waModel())->query('SELECT id, name FROM crm_deal WHERE id=?', [$term])->fetchAssoc();
        if ($deal) {
            $prettifier->addEntity([
                'app_id' => 'crm',
                'entity_type' => 'deal',
                'entity_image' => null,
                'entity_title' => $deal['name'],
                'entity_url' => wa()->getAppUrl('crm')."deal/{$deal['id']}/",
            ]);
        }
    }

    protected function loadCrmDealsByName($prettifier, $term, $limit)
    {
        $limit -= $prettifier->count();
        if ($limit <= 0) {
            return;
        }

        $m = new waModel();
        $deals = $m->query('SELECT id, name FROM crm_deal WHERE name LIKE ? LIMIT '.((int)$limit), [
            '%'.str_replace(['%', '_'], ['\\%', '\\_'], $term).'%'
        ])->fetchAll();

        foreach($deals as $deal) {
            $prettifier->addEntity([
                'app_id' => 'crm',
                'entity_type' => 'deal',
                'entity_image' => null,
                'entity_title' => $deal['name'],
                'entity_url' => wa()->getAppUrl('crm')."deal/{$deal['id']}/",
            ]);
        }
    }

    protected function loadCrmContactsByName($prettifier, $term, $limit)
    {
        $limit -= $prettifier->count();
        if ($limit <= 0) {
            return;
        }
        $m = new waModel();
        $contacts = $m->query('SELECT id, name, photo, is_company FROM wa_contact WHERE name LIKE ? LIMIT '.((int)$limit), [
            '%'.str_replace(['%', '_'], ['\\%', '\\_'], $term).'%'
        ])->fetchAll();

        foreach($contacts as $c) {
            $prettifier->addEntity([
                'app_id' => 'crm',
                'entity_type' => 'contact',
                'entity_image' => waContact::getPhotoUrl($c['id'], $c['photo'], null, null, ($c['is_company'] ? 'company' : 'person')),
                'entity_title' => $c['name'],
                'entity_url' => wa()->getAppUrl('crm')."contact/{$c['id']}/",
            ]);
        }
    }

    protected function loadShopEntities($prettifier, $term, $limit)
    {
        if ($limit <= $prettifier->count() || !wa()->appExists('shop') || !wa()->getUser()->getRights('shop', 'backend')) {
            return;
        }

        wa('shop');
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
                $prettifier->addEntity($getRow(reset($orders)));
            }
        }

        // encoded order id?
        $collection = new shopOrdersCollection('search/id='.$term);
        $orders = $collection->getOrders('id', 0, 1);
        if ($orders) {
            $prettifier->addEntity($getRow(reset($orders)));
        }

        // product name?
        if ($limit > $prettifier->count()) {
            $collection = new shopProductsCollection('search/query='.$term);
            $products = $collection->getProducts('id,name', 0, $limit - $prettifier->count());
            foreach($products as $p) {
                $prettifier->addEntity([
                    'app_id' => 'shop',
                    'entity_type' => 'product',
                    'entity_image' => null,
                    'entity_title' => $p['name'],
                    'entity_url' => wa()->getAppUrl('shop')."products/{$p['id']}/",
                ]);
            }
        }
    }
}
