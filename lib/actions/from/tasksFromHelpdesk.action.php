<?php
class tasksFromHelpdeskAction extends waViewAction
{
    public function execute()
    {
        wa('helpdesk');
        $request_id = waRequest::request('id', 0, 'int');
        $request = new helpdeskRequest($request_id);

        $task = new tasksTask();
        $task['name'] = $request->summary;
        $task['text'] = $request->text."\n\n".sprintf('[%s](%s)',
            // Link text
            sprintf_wp('Helpdesk request: %s',
                htmlspecialchars(str_replace(array('[', ']'), ' ', $request->summary))
            ),
            // Link href
            rtrim(wa()->getRootUrl(true), '/').'/'.ltrim(wa()->getAppUrl('helpdesk'), '/').'#/request/'.$request_id.'/'
        );
        //$task['params'] = array( // !!! makes sense when/if tasks will actually have params implemented
        //    'helpdesk_request_id' => $request_id,
        //);

        $this->setTemplate(wa('tasks')->getAppPath(tsks()->getUI2TemplatePath('templates/actions%s/from/Reloader.html')));
        $this->view->assign(array(
            'task' => $task,
        ));
    }
}
