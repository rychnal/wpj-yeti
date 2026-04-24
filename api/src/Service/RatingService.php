<?php

namespace App\Service;

use App\Repository\RatingRepository;
use App\Repository\YetiRepository;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class RatingService
{
    public function __construct(
        private readonly RatingRepository $ratingRepository,
        private readonly YetiRepository $yetiRepository,
    ) {}

    public function rate(int $yetiId, int $score, int $userId): void
    {
        $this->validateYetiExists($yetiId);
        if ($this->ratingRepository->hasUserRatedYeti($userId, $yetiId)) {
            throw new ConflictHttpException("Yeti #{$yetiId} jsi již ohodnotil.");
        }
        $this->ratingRepository->insert($yetiId, $score, $userId);
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
