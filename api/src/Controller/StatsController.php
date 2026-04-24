<?php

namespace App\Controller;

use App\Service\StatsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/stats', name: 'stats_')]
class StatsController extends AbstractController
{
    public function __construct(private readonly StatsService $statsService) {}

    #[Route('/monthly', name: 'monthly', methods: ['GET'])]
    public function monthly(Request $request): JsonResponse
    {
        $period = $request->query->get('period', 'year');
        return $this->json($this->statsService->getChartData($period));
    }

    #[Route('/summary', name: 'summary', methods: ['GET'])]
    public function summary(Request $request): JsonResponse
    {
        $period = $request->query->get('period', 'year');
        return $this->json($this->statsService->getSummaryByPeriod($period));
    }

    #[Route('/user/{id}', name: 'user', methods: ['GET'])]
    public function userStats(int $id): JsonResponse
    {
        return $this->json($this->statsService->getUserStats($id));
    }
}
