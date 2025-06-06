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

            if (!isset($apps_handled['helpdesk'])) {
                $this->loadHelpdeskEntities($prettifier, $term, $limit);
            }

            if (!isset($apps_handled['hub'])) {
                $this->loadHubEntities($prettifier, $term, $limit);
            }
        }

        return array_values($prettifier->getData());
    }

    protected function loadUsers($prettifier, $term, $limit)
    {
        $term = mb_strtolower($term);
        $users = (new tasksTeamGetter())->getTeam(new taskTeamGetterParamsDto(null, false));

        $contacts_order = [];
        if (!empty($this->options['context_task_id'])) {
            // task creator and current assigned user are at the top of the list
            $task_model = new tasksTaskModel();
            $task = $task_model->select('create_contact_id, assigned_contact_id')->where('id=?', [$this->options['context_task_id']])->fetchAssoc();
            if ($task) {
                $contacts_order[$task['assigned_contact_id']] = true;
                $contacts_order[$task['create_contact_id']] = true;

                // order other users by how many records they have in task log
                $task_log_model = new tasksTaskLogModel();
                $contacts_order += $task_log_model->getLogCountsByContact([$this->options['context_task_id']]);
            }

        }

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

            $contacts_order[$u['id']] = $u;
        }

        foreach($contacts_order as $u) {
            if (is_array($u)) {
                $prettifier->addMention($u);
            }
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
        try {
            $deal = (new waModel())->query('SELECT id, name FROM crm_deal WHERE id=?', [$term])->fetchAssoc();
        } catch (waDbException $e) {
            return; // app never started yet
        }
        if ($deal) {
            $prettifier->addEntity([
                'app_id' => 'crm',
                'entity_type' => 'deal',
                'entity_id' => $deal['id'],
                'entity_image' => null,
                'entity_title' => $deal['name'],
                'entity_url' => $this->getAppBackendUrl('crm')."deal/{$deal['id']}/",
            ]);
        }
    }

    protected function loadCrmDealsByName($prettifier, $term, $limit)
    {
        $limit -= $prettifier->count();
        if ($limit <= 0) {
            return;
        }

        try {
            $m = new waModel();
            $deals = $m->query('SELECT id, name FROM crm_deal WHERE name LIKE ? LIMIT '.((int)$limit), [
                '%'.str_replace(['%', '_'], ['\\%', '\\_'], $term).'%'
            ])->fetchAll();
        } catch (waDbException $e) {
            return; // app never started yet
        }

        foreach($deals as $deal) {
            $prettifier->addEntity([
                'app_id' => 'crm',
                'entity_type' => 'deal',
                'entity_id' => $deal['id'],
                'entity_image' => null,
                'entity_title' => $deal['name'],
                'entity_url' => $this->getAppBackendUrl('crm')."deal/{$deal['id']}/",
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
                'entity_id' => $c['id'],
                'entity_image' => waContact::getPhotoUrl($c['id'], $c['photo'], null, null, ($c['is_company'] ? 'company' : 'person')),
                'entity_title' => $c['name'],
                'entity_url' => $this->getAppBackendUrl('crm')."contact/{$c['id']}/",
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
                'entity_id' => $o['id'],
                'entity_image' => null,
                'entity_title' => $o['id_encoded'],
                'entity_url' => $this->getAppBackendUrl('shop')."#/orders/id={$o['id']}/",
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
            $products = $collection->getProducts('id,name', 0, $limit - $prettifier->count(), false);
            foreach($products as $p) {
                $prettifier->addEntity([
                    'app_id' => 'shop',
                    'entity_type' => 'product',
                    'entity_id' => $p['id'],
                    'entity_image' => null,
                    'entity_title' => $p['name'],
                    'entity_url' => $this->getAppBackendUrl('shop')."products/{$p['id']}/",
                ]);
            }
        }
    }

    protected function loadHelpdeskEntities($prettifier, $term, $limit)
    {
        if ($limit <= $prettifier->count() || !wa()->appExists('helpdesk') || !wa()->getUser()->getRights('helpdesk', 'backend')) {
            return;
        }

        if (wa_is_int($term)) {
            wa('helpdesk');
            $request_model = new helpdeskRequestModel();
            $request = $request_model->getById($term);

            if ($request) {
                $prettifier->addEntity([
                    'app_id' => 'helpdesk',
                    'entity_type' => 'request',
                    'entity_id' => $request['id'],
                    'entity_title' => htmlspecialchars($request['summary']),
                    'entity_url' => $this->getAppBackendUrl('helpdesk')."#/request/{$request['id']}/",
                ]);
            }
        }
    }

    protected function loadHubEntities($prettifier, $term, $limit)
    {
        if ($limit <= $prettifier->count() || !wa()->appExists('hub') || !wa()->getUser()->getRights('hub', 'backend')) {
            return;
        }

        try {
            $sql = "SELECT id, title
                    FROM hub_topic
                    WHERE title LIKE ?
                    LIMIT ".((int) $limit - $prettifier->count());
            $rows = (new waModel())->query($sql, ["%$term%"]);
        } catch (waDbException $e) {
            return; // app never started yet
        }

        foreach($rows as $topic) {
            $prettifier->addEntity([
                'app_id' => 'hub',
                'entity_type' => 'topic',
                'entity_id' => $topic['id'],
                'entity_title' => htmlspecialchars($topic['title']),
                'entity_url' => $this->getAppBackendUrl('hub')."#/topic/{$topic['id']}/",
            ]);
        }
    }

    protected function getAppBackendUrl($app)
    {
        $config = wa()->getConfig();
        $url = $config->getRootUrl();

        if (!empty($this->options['absolute_urls'])) {
            $url = wa()->getConfig()->getHostUrl().$url;
        }

        if ($app == 'webasyst') {
            return $url.$config->getBackendUrl()."/";
        } else {
            return $url.$config->getBackendUrl()."/".$app."/";
        }
    }

}
