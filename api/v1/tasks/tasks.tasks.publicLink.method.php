<?php

class tasksTasksPublicLinkMethod extends tasksApiAbstractMethod
{
    protected $method = self::METHOD_POST;

    public function run(): tasksApiResponseInterface
    {
        $request = new tasksApiTasksPublicLinkRequest(
            $this->post('id', true, self::CAST_INT),
            $this->post('publish', true, self::CAST_BOOLEAN)
        );

        $hash = (new tasksApiTasksPublicLinkHandler())->publish($request);
        $urls = [];
        foreach (wa()->getRouting()->getDomains() as $domain) {
            $urls[] = wa()->getRouting()->getUrl('/frontend', ['public_hash' => $hash], true, $domain);
        }


        return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, $urls);
    }
}
