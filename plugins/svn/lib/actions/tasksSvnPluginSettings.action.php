<?php

class tasksSvnPluginSettingsAction extends waViewAction
{
    public function execute()
    {
        $token_model = new waApiTokensModel();
        $token = $token_model->getToken(0, 'tasks/svn', 'tasks');
        
        $url = wa()->getRootUrl(true, false).'api.php/tasks/svn?access_token='.$token;
        $this->view->assign('url', $url);
    }
}
