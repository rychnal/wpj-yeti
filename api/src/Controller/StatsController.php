<?php

namespace App\Controller;

use App\Service\StatsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/stats', name: 'stats_')]
class StatsController extends AbstractController
{
    public function __construct(private readonly StatsService $statsService) {}

    #[Route('/monthly', name: 'monthly', methods: ['GET'])]
    public function monthly(): JsonResponse
    {
        return $this->json($this->statsService->getMonthlyStats());
    }

    #[Route('/summary', name: 'summary', methods: ['GET'])]
    public function summary(): JsonResponse
    {
        return $this->json($this->statsService->getSummary());
    }

    #[Route('/user/{id}', name: 'user', methods: ['GET'])]
    public function userStats(int $id): JsonResponse
    {
        return $this->json($this->statsService->getUserStats($id));
    }
}
