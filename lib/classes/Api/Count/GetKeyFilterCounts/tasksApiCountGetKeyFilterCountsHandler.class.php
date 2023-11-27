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

        list($hash_fav, $hash_unread) = $this->getFavoritesCountsPair();

        return [
            tasksCollection::HASH_INBOX => $this->getInboxCountPair($user),
            tasksCollection::HASH_OUTBOX => $this->getOutboxCountsPair(),
            tasksCollection::HASH_FAVORITES => $hash_fav,
            tasksCollection::HASH_FAVORITES_UNREAD => $hash_unread,
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

    private function getFavoritesCountsPair(): array
    {
        $counts = $this->countService->getFavoritesCounts();

        return [
            new tasksUserTasksCountPairDto((int) $counts['count'], (int) $counts['total']),
            new tasksUserTasksCountPairDto((int) $counts['unread'], (int) $counts['unread_total']),
        ];
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
