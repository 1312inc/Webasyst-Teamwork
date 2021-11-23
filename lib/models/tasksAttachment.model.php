<?php
class tasksAttachmentModel extends waModel
{
    protected $table = 'tasks_attachment';

    public function getData(tasksTask $task)
    {
        return $this->getByField('task_id', $task['id'], 'id');
    }

    public function getByLogId($logId): ?array
    {
        return $this->getByField('log_id', $logId, true);
    }

    public function generateCode()
    {
        $result = '';
        $symbols = '1234567890qwertyuiopasdfghjklzxcvbnm';
        for($i = 0; $i < 16; $i++) {
            $result .= $symbols[mt_rand(0, strlen($symbols)-1)];
        }
        return $result;
    }

    /**
     * @param int $task_id
     * @param null|int $log_id
     * @param string $file file path
     * @return bool|int
     */
    public function addAttachment($task_id, $log_id, $file)
    {
        if (!is_string($file) && !file_exists($file)) {
            return false;
        }

        $path_info = pathinfo($file);
        $file_name = (string)ifset($path_info['basename']);
        $file_size = (int)@filesize($file);
        $file_ext = (string)ifset($path_info['extension']);

        $data = array(
            'task_id'         => $task_id,
            'log_id'          => ifempty($log_id),
            'create_datetime' => date('Y-m-d H:i:s'),
            'contact_id'      => wa()->getUser()->getId(),
            'name'            => $file_name,
            'size'            => $file_size,
            'ext'             => strtolower($file_ext),
            'code'            => $this->generateCode(),
        );

        $id = $this->insert($data);
        if ($id <= 0) {
            return false;
        }

        $data['id'] = $id;
        $path = tasksHelper::getAttachPath($data);
        $success = waFiles::move($file, $path);

        if (!$success) {
            $this->deleteById($id);
            return false;
        }

        $this->fixImageOrientation($path);

        return $id;
    }

    protected function fixImageOrientation($file_path)
    {
        if (!function_exists('exif_read_data')) {
            return;
        }
        $exif_data = @exif_read_data($file_path);
        if (!$exif_data || empty($exif_data['Orientation'])) {
            return;
        }

        $angles = array(
            3 => '180', 4 => '180',
            5 => '90',  6 => '90',
            7 => '-90', 8 => '-90'
        );
        $angle = ifset($angles[$exif_data['Orientation']]);
        if ($angle) {
            try {
                $image = waImage::factory($file_path);
                $image->rotate($angle);
                $image->save();
            } catch (Exception $e) {
            }
        }
    }

    public function addAttachmentsByHash($task_id, $log_id, $hash)
    {
        $temp_path = wa('tasks')->getTempPath('files', 'tasks');
        $mail_dir = $temp_path.'/'.$hash;
        foreach (waFiles::listdir($mail_dir) as $file_path) {
            $this->addAttachment($task_id, $log_id, $mail_dir.'/'.$file_path);
        }
        try {
            waFiles::delete($mail_dir);
        } catch (waException $e) {

        }
    }

    /**
     * @param int|int[] $log_id Log ID or Log IDs
     * @return int|array
     *   - If $log_id is singular (scalar) than return just singular count (scalar)
     *   - Otherwise array of counters indexed by ID
     *     It's guaranteed that this array will has value for each ID (that > 0) in input array
     */
    public function countByLogId($log_id)
    {
        $log_ids = tasksHelper::toIntArray($log_id);
        $log_ids = tasksHelper::dropNotPositive($log_ids);
        if (!$log_ids) {
            return array();
        }

        $is_scalar_input = is_scalar($log_id);

        $sql = "SELECT log_id, COUNT(*) AS `count` 
                FROM `{$this->table}` WHERE log_id IN(:log_ids)";
        if (!$is_scalar_input) {
            $sql .= " GROUP BY log_id";
        }

        $result = $this->query($sql, array('log_ids' => $log_ids))->fetchAll('log_id', true);

        if ($is_scalar_input) {
            return (int)ifset($result[$log_id]);
        } else {
            return $result + array_fill_keys($log_ids, 0);
        }
    }
}
