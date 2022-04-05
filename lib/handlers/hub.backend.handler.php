<?php
class tasksHubBackendHandler extends waEventHandler
{
    public function execute(&$params)
    {
        if (!wa()->getUser()->getRights('tasks', 'backend')) {
            return null;
        }

        return array(
            'head' => $this->getHtml(),
        );
    }

    protected function getHtml() {
        $uniqid = str_replace('.', '-', uniqid('s', true));
        $menuname = htmlspecialchars(_w('Create task'));
        $tasks_url = wa()->getAppUrl('tasks');
        $wa_url = wa()->getRootUrl();
        if (wa()->whichUI() == '1.3') {
            return <<<EOF

                <!-- begin output from tasksHubBackendHandler -->
                <ul style="display:none" id="{$uniqid}">
                    <li><a href="{$tasks_url}#/from/hub/%TASK_ID%/"><i class="icon16" style="background-image:url('{$wa_url}wa-apps/tasks/img/tasks24.png');background-size:16px 16px"></i>{$menuname}</a></li>
                </ul>
                <script>(function() {
                    var wrapper = $('#{$uniqid}');
                    var li = wrapper.children('li').detach();
                    wrapper.remove(); wrapper = null;
                    $(window).on('wa_loaded', function() {
                        var matches = $.hub.helper.cleanHash().match(new RegExp('^#/topic/(\\\\d+)/$'));
                        if (matches) {
                            var cloned_li = li.clone().prependTo('#content .h-topic .details .float-right.block .menu-h');
                            var a = cloned_li.find('a')[0];
                            a.href = a.href.replace('%TASK_ID%', matches[1]);
                        }
                    });
                })();</script>
                <!-- end output from tasksHubBackendHandler -->
EOF;
        } else {
            return <<<EOF

                <!-- begin output from tasksHubBackendHandler -->
                <div id="{$uniqid}" class="custom-mt-16 custom-mr-16">
                    <a href="{$tasks_url}#/from/hub/%TASK_ID%/" class="semibold small nowrap">
                        <i class="icon" style="background-image:url('{$wa_url}wa-apps/tasks/img/tasks24.png'); background-size:16px 16px; vertical-align: -2px;"></i>
                        <span class="custom-ml-4">{$menuname}</span>
                    </a>
                </div>

                <script>(function() {
                    const wrapper = $('#{$uniqid}');

                    wrapper.detach();

                    $(window).on('wa_loaded', function() {
                        const matches = $.hub.helper.cleanHash().match(new RegExp('^#/topic/edit/(\\\\d+)/$'));
                        if (!matches) {
                            return;
                        }

                        wrapper.insertAfter('.js-topic-tags');
                        const a = wrapper.find('a')[0];
                        a.href = a.href.replace('%TASK_ID%', matches[1]);
                    });
                })();</script>
                <!-- end output from tasksHubBackendHandler -->
EOF;
        }
    }
}
