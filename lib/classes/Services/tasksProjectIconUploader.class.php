<?php

final class tasksProjectIconUploader
{
    private const BASE_DIR = 'project_icons/';

    /**
     * @return false|string
     * @throws waException
     */
    public function uploadIcon(string $iconsHash, int $projectId)
    {
        $tempPath = wa(tasksConfig::APP_ID)->getTempPath('files', 'tasks');
        $iconDir = $tempPath . '/' . $iconsHash;
        foreach (waFiles::listdir($iconDir) as $iconPath) {
            $iconInfo = new SplFileInfo($iconDir . '/' . $iconPath);

            try {
                $image = waImage::factory($iconDir . '/' . $iconPath);
                $image->resize(300);
            } catch (Exception $exception) {
                tasksLogger::error(sprintf('%s - not an image', $iconInfo->getBasename()));

                continue;
            }

            $path = $this->getProjectIconsPath($projectId);
            $newName = tasksUuid4::generate() . '.' . $image->getExt();
            $success = $image->save(sprintf('%s/%s', $path, $newName));
            if ($success) {
                $this->clear($iconDir);

                return sprintf('%s/%s', $this->getProjectIconsUrl($projectId), $newName);
            }
        }

        $this->clear($iconDir);

        return false;
    }

    public function getProjectIconsPath($projectId): string
    {
        $projectIconsPath = wa()->getDataPath(self::BASE_DIR . $projectId, true, 'tasks', true);
        waFiles::create($projectIconsPath);

        return $projectIconsPath;
    }

    private function getProjectIconsUrl($projectId): string
    {
        return wa()->getDataUrl(self::BASE_DIR . $projectId, true, 'tasks', true);
    }

    private function clear($iconDir)
    {
        try {
            waFiles::delete($iconDir);
        } catch (waException $e) {
        }
    }
}
