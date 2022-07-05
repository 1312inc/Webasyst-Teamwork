<?php

final class tasksApiCountGetKeyFilterCountsHandler
{
    /**
     * @var tasksUserTasksCounterService
     */
    private $countService;

    public function __construct()
    {
        $this->countService = new tasksUserTasksCounterService();
    }

    public function get()
    {
        $user = wa()->getUser();

        return [
            tasksCollection::HASH_INBOX => $this->getInboxCountPair($user),
            tasksCollection::HASH_OUTBOX => $this->getOutboxCountsPair(),
            tasksCollection::HASH_FAVORITES => $this->getFavoritesCountsPair(),
//            'hidden' => $this->getHiddenCountsPair($user),
            tasksCollection::HASH_URGENT => $this->getUrgentCountsPair(),
        ];
    }

    private function getPair($total = 0, $count = 0, $red = 0): tasksUserTasksCountPairDto
    {
        if (!$count) {
            return new tasksUserTasksCountPairDto(0, (int) $total);
        }

        // todo: suka takoi podgon pod resultat =/
        if ($red) {
            return new tasksUserTasksCountPairDto($red, (int) $total);
        }

        if ($count == $total) {
            return new tasksUserTasksCountPairDto(0, (int) $count);
        }

        return new tasksUserTasksCountPairDto((int) $count, (int) $total);
    }

    private function getInboxCountPair(waContact $contact): tasksUserTasksCountPairDto
    {
        $userCounts = $this->countService->getTeamCounts($contact);
        if (!isset($userCounts[$contact->getId()])) {
            $userCounts = ['total' => 0, 'count' => 0];
        } else {
            $userCounts = $userCounts[$contact->getId()];
        }
        $hiddenCount = $this->countService->getHiddenCount($contact);

        if ($userCounts['total'] == $userCounts['count']) {
            $inboxUrgentCount = $userCounts['count'] - $hiddenCount;
        } else {
            $inboxUrgentCount = $userCounts['count'];
        }

        return $this->getPair((int) ($userCounts['total'] - $hiddenCount),
            (int) $inboxUrgentCount,
            !empty($userCounts['priority']) ? (int) $inboxUrgentCount : 0
        );
    }

    private function getFavoritesCountsPair(): tasksUserTasksCountPairDto
    {
        $counts = $this->countService->getFavoritesCounts();

        return $this->getPair((int) $counts['count'], (int) $counts['total']);
    }

    private function getOutboxCountsPair(): tasksUserTasksCountPairDto
    {
        $counts = $this->countService->getOutboxCount();

        return new tasksUserTasksCountPairDto(0, $counts);
    }

    private function getHiddenCountsPair(waContact $contact): tasksUserTasksCountPairDto
    {
        $counts = $this->countService->getHiddenCount($contact);

        return new tasksUserTasksCountPairDto(0, $counts);
    }

    private function getUrgentCountsPair(): tasksUserTasksCountPairDto
    {
        $counts = $this->countService->getUrgentCount();
        $countsSuper = $this->countService->getSuperUrgentCount();

        return $this->getPair($counts, $countsSuper);
    }
}
