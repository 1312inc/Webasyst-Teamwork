<?php

class tasksTasksLinksMethod extends tasksApiAbstractMethod
{
    public function run(): tasksApiResponseInterface
    {
        $task_id = $this->get('id', true, self::CAST_INT);

        $repository = tsks()->getEntityRepository(tasksTask2::class);
        $task = $repository->findById($task_id);
        if (!$task) {
            throw new tasksException('Not found', 404);
        }

        $links_data = (new tasksLinksPrettifier(['absolute_urls' => true]))->addFromMarkdown($task->getText())->getData();
        foreach($links_data as $code => &$link) {
            $link['markdown_code'] = $code;
        }
        unset($link);

        return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, [
            'data' => array_values($links_data),
        ]);
    }
}
