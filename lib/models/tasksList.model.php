<?php

class tasksListModel extends waModel
{
    protected $table = 'tasks_list';

    public static function getIcons()
    {
        return array(
            'contact',
            'search',
            'user',
            'folder',
            'notebook',
            'lock',
            'lock-unlocked',
            'broom',
            'star',
            'livejournal',
            'lightning',
            'light-bulb',
            'pictures',
            'reports',
            'books',
            'marker',
            'lens',
            'alarm-clock',
            'animal-monkey',
            'anchor',
            'bean',
            'car',
            'disk',
            'cookie',
            'burn',
            'clapperboard',
            'bug',
            'clock',
            'cup',
            'home',
            'fruit',
            'luggage',
            'guitar',
            'smiley',
            'sport-soccer',
            'target',
            'medal',
            'phone',
            'store',
            'basket',
            'pencil',
            'lifebuoy',
            'screen'
        );
    }

    /**
     * @param array $data
     * @return bool|int|resource
     */
    public function add($data)
    {
        if (!isset($data['contact_id'])) {
            $data['contact_id'] = wa()->getUser()->getId();
        }

        $data['create_datetime'] = date('Y-m-d H:i:s');

        if (isset($data['name']) && is_scalar($data['name'])) {
            $data['name'] = trim((string)$data['name']);
        } else {
            $data['name'] = 'no name';
        }

        if (isset($data['hash']) && is_scalar($data['hash'])) {
            $data['hash'] = trim(trim((string)ifset($data['hash'])), '/');
        } else {
            $data['hash'] = '';
        }

        if (isset($data['params']) && is_scalar($data['params'])) {
            $data['params'] = trim((string)$data['params']);
            $data['params'] = explode('&', $data['params']);

            // normalize, for simplify finding proper view
            // see method find
            sort($data['params']);

            $data['params'] = join('&', $data['params']);
        } else {
            $data['params'] = null;
        }

        if (isset($data['order']) && is_scalar($data['order'])) {
            $data['order'] = trim((string)$data['order']);
            if (strlen($data['order']) <= 0) {
                $data['order'] = null;
            }
        } else {
            $data['order'] = null;
        }

        $collection = new tasksCollection($data['hash']);
        $data['count'] = $collection->count();

        return $this->insert($data);
    }

    public function findOne($hash, $params = null, $order = null, $contact_id = null)
    {
        if (!$contact_id) {
            $contact_id = wa()->getUser()->getId();
        }

        $where = array(
            'contact_id' => $contact_id,
            'hash' => $hash
        );

        if (is_scalar($params)) {
            $params = trim((string)$params);
            $params = explode('&', $params);

            // normalize, like in adding,
            // see add method
            sort($params);

            $params = join('&', $params);
            $where['params'] = $params;
        }

        if (is_scalar($order)) {
            $order = trim((string)$order);
            $where['order'] = $order;
        }

        return $this->getByField($where);
    }

    /**
     * @param $id
     * @param tasksCollection $collection
     */
    public function updateCountByCollection($id, $collection)
    {
        $this->updateById($id, array(
            'count' => $collection->count()
        ));
    }
}
