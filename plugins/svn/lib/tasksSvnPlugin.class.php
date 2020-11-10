<?php

class tasksSvnPlugin extends waPlugin
{
    public function taskLog(&$log)
    {
        if (!$log) {
            return;
        }

        foreach ($log as &$l) {
            if ($l['action'] == 'svn.commit' && !empty($l['params']['diff'])) {
                $diff = json_decode($l['params']['diff'], true);
                $diff_html = '';
                foreach ($diff as $row) {
                    $diff_html .= nl2br(htmlspecialchars($row));
                }
                $l['text'].= '<div class="diff">'.$diff_html.'</div>';
            }
        }
        unset($l);
    }
}
