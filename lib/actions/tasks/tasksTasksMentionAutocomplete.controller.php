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

        $prettifier = new tasksLinksPrettifier();
        $result = $this->loadUsers($prettifier, $term, $limit);

        $this->response = array_values($prettifier->getData());
    }

    protected function loadUsers($prettifier, $term, $limit)
    {
        $term = mb_strtolower($term);
        $users = (new tasksTeamGetter())->getTeam(new taskTeamGetterParamsDto(null, false));

        $result = [];
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
}
