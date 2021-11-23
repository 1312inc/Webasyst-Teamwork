<?php

class tasksCountsGetKeyFilterCountsMethod extends tasksApiAbstractMethod
{
    public function run(): tasksApiResponseInterface
    {
        $countData = (new tasksApiCountGetKeyFilterCountsHandler())->get();

        $response = [];
        /**
         * @var string                     $hash
         * @var tasksUserTasksCountPairDto $countDatum
         */
        foreach ($countData as $hash => $countDatum) {
            $response[] = new tasksApiHashCountDto(
                $hash,
                new tasksApiCountsDto(
                    null,
                    $countDatum->getCountRed(),
                    $countDatum->getTotal(),
                    $countDatum->getTotal()
                )
            );
        }

        return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, ['data' => $response]);
    }
}
