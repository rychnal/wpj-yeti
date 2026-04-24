<?php

namespace App\Service;

use App\Repository\RatingRepository;

class StatsService
{
    public function __construct(private readonly RatingRepository $ratingRepository) {}

    public function getMonthlyStats(): array
    {
        return $this->ratingRepository->getMonthlyAggregates();
    }

    public function getChartData(string $period): array
    {
        return $this->ratingRepository->getAggregatesByPeriod($period);
    }

    public function getSummary(?\DateTimeImmutable $since = null): array
    {
        return $this->ratingRepository->getSummary($since);
    }

    public function getSummaryByPeriod(string $period): array
    {
        $since = match($period) {
            'day'   => new \DateTimeImmutable('-1 day'),
            'month' => new \DateTimeImmutable('-1 month'),
            default => new \DateTimeImmutable('-1 year'),
        };

        return $this->ratingRepository->getSummary($since);
    }

    public function getUserStats(int $userId): array
    {
        return $this->ratingRepository->getUserStats($userId);
    }
}
