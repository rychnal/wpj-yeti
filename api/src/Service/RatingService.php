<?php

namespace App\Service;

use App\Repository\RatingRepository;
use App\Repository\YetiRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class RatingService
{
    public function __construct(
        private readonly RatingRepository $ratingRepository,
        private readonly YetiRepository $yetiRepository,
    ) {}

    public function rate(int $yetiId, int $score): void
    {
        $this->validateYetiExists($yetiId);
        $this->ratingRepository->insert($yetiId, $score);
    }

    public function validateYetiExists(int $id): void
    {
        if (!$this->yetiRepository->existsById($id)) {
            throw new NotFoundHttpException("Yeti #{$id} not found.");
        }
    }

    public function skip(int $yetiId): void
    {
        $this->validateYetiExists($yetiId);
    }
}
