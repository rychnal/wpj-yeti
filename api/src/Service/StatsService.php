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

    public function getSummary(): array
    {
        return $this->ratingRepository->getSummary();
    }

    public function getTopByPeriod(string $period): array
    {
        return $this->ratingRepository->getMonthlyAggregates();
    }
}
