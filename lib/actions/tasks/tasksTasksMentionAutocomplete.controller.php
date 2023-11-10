<?php
/**
 * Autocomplete when user enters @ in task editor.
 */
class tasksTasksMentionAutocompleteController extends waJsonController
{
    const DEFAULT_LIMIT = 20;

    public function execute()
    {
        $limit = waRequest::request('limit', self::DEFAULT_LIMIT, 'int');
        $limit = min($limit, 50);
        $term = waRequest::request('term', '', 'string');

        $result = $this->loadUsers($term, $limit);

        $this->response = $result;
    }

    protected function loadUsers($term, $limit)
    {
        $term = mb_strtolower($term);
        $users = (new tasksTeamGetter())->getTeam(new taskTeamGetterParamsDto(null, true));

        $result = [];
        foreach($users as $u) {

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

            $result[] = [
                'app_id' => 'tasks',
                'entity_type' => 'user',
                'entity_image' => waContact::getPhotoUrl($u['id'], $u['photo'], null, null, ($u['is_company'] ? 'company' : 'person')),
                'entity_title' => $u['name'],
                'entity_url' => wa()->getAppUrl('team')."u/{$u['login']}/",
                'user_login' => $u['login'],
            ];
        }
        return $result;
    }
}
