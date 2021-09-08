<?php

class tasksCountsForHashMethod extends tasksApiAbstractMethod
{
    public function run(): tasksApiResponseInterface
    {
        $countData = (new tasksApiCountForHashHandler())->get();

        $response = [];
        /**
         * @var string $hash
         * @var tasksUserTasksCountPairDto $countDatum
         */
        foreach ($countData as $hash => $countDatum) {
            $response[] = new tasksApiHashCountDto(
                $hash,
                new tasksApiCountsDto(null, $countDatum->getCountRed(), $countDatum->getTotal(), null)
            );
        }

        return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, ['data' => $response]);
    }
}
