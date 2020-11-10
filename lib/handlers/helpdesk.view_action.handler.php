<?php
class tasksHelpdeskView_actionHandler extends waEventHandler
{
    public function execute(&$params)
    {
        if (!ifset($params['action']) instanceof helpdeskRequestsInfoAction) {
            return null;
        }
        if (!wa()->getUser()->getRights('tasks', 'backend')) {
            return null;
        }

        return $this->getHtml($params['action']->request_id);
    }

    protected function getHtml($request_id) {
        $uniqid = str_replace('.', '-', uniqid('s', true));

        //Make tasks active app and get translate
        wa('tasks', 1);
        $menuname = htmlspecialchars(_w('Create task from this'));
        //Return helpdesk acitive status
        wa('helpdesk', 1);

        $tasks_url = wa()->getAppUrl('tasks');
        $wa_url = wa()->getRootUrl();
        return <<<EOF

            <!-- begin output from tasksHelpdeskView_actionHandler -->
            <ul style="display:none" id="{$uniqid}">
                <li><a href="{$tasks_url}#/from/helpdesk/{$request_id}/"><i class="icon16" style="background-image:url('{$wa_url}wa-apps/tasks/img/tasks24.png');background-size:16px 16px"></i>{$menuname}</a></li>
            </ul>
            <script>(function() {
                var wrapper = $('#{$uniqid}');
                var dropdown = $('#h-request-operations .menu-v');
                wrapper.children('li').insertBefore(dropdown.children('li.hr:last'));
                wrapper.remove();
            })();</script>
            <!-- end output from tasksHelpdeskView_actionHandler -->
EOF;
    }
}
