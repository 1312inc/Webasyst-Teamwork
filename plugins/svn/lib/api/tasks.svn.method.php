<?php

class tasksSvnMethod extends waAPIMethod
{
    protected $method = 'POST';

    public function execute()
    {
        $data = array();
        foreach (array('rev', 'comment', 'author', 'changed', 'diff') as $k) {
            $data[$k] = $this->post($k, true);
        }
        waLog::log(print_r($data, true), 'tasks.svn.log');

        if (preg_match_all("/#(\d+\.\d+)/uis", $data['comment'], $match)) {
            $task_model = new tasksTaskModel();
            $task_log_model = new tasksTaskLogModel();
            $log = $this->prepareLog($data);
            foreach ($match[1] as $task_code) {
                list($project_id, $task_number) = explode('.', $task_code, 2);
                $task = $task_model->getByField(array(
                    'project_id' => $project_id,
                    'number' => $task_number
                ));
                if ($task) {
                    $task_log_model->add(array(
                        'contact_id' => 0,
                        'task_id' => $task['id'],
                        'before_status_id' => $task['status_id'],
                        'after_status_id' => $task['status_id'],
                    ) + $log);
                }
            }
        }

        $this->response['status'] = 'ok';
    }

    protected function prepareLog($data)
    {
        $text = $data['author'].' committed revision '.$data['rev'].'.<br>'.htmlspecialchars($data['comment']);
        $text .= '<div class="changed">'.nl2br($data['changed']).'</div>';

        return array(
            'action' => 'svn.commit',
            'text' => $text,
            'params' => array(
                'diff' => preg_split("/=+\r?\n/uis", $data['diff'])
            )
        );
    }
}
