<?php

namespace App\Controller;

use App\DTO\CreateYetiDTO;
use App\Service\YetiService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/yeti', name: 'yeti_')]
class YetiController extends AbstractController
{
    public function __construct(
        private readonly YetiService $yetiService,
        private readonly ValidatorInterface $validator,
        #[Autowire('%kernel.project_dir%/public/uploads/yeti')]
        private readonly string $uploadsDir,
    ) {}

    #[Route('', name: 'list', methods: ['GET'])]
    public function listTopRated(): JsonResponse
    {
        return $this->json($this->yetiService->getTopRated());
    }

    #[Route('/match/batch', name: 'match_batch', methods: ['GET'])]
    public function matchBatch(Request $request): JsonResponse
    {
        $userId = $request->query->getInt('user_id');
        if (!$userId) {
            return $this->json([]);
        }

        $rawExcludeIds = $request->query->get('exclude_ids', '');
        $excludeIds = $rawExcludeIds !== ''
            ? array_values(array_filter(array_map('intval', explode(',', $rawExcludeIds)), fn(int $id) => $id > 0))
            : [];

        return $this->json($this->yetiService->getMatchBatchForUser($userId, 10, $excludeIds));
    }

    #[Route('/match', name: 'match', methods: ['GET'])]
    public function matchYeti(Request $request): JsonResponse
    {
        $userId = $request->query->getInt('user_id');

        $yeti = $userId
            ? $this->yetiService->getMatchForUser($userId)
            : $this->yetiService->getRandomMatch();

        return $this->json($yeti);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        $dto = new CreateYetiDTO();
        $dto->name        = trim((string) ($data['name'] ?? ''));
        $dto->gender      = trim((string) ($data['gender'] ?? ''));
        $dto->heightCm    = (int) ($data['height_cm'] ?? 0);
        $dto->weightKg    = (int) ($data['weight_kg'] ?? 0);
        $dto->location    = trim((string) ($data['location'] ?? ''));
        $dto->description = isset($data['description']) ? trim((string) $data['description']) : null;

        $errors = $this->validator->validate($dto);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $messages[$error->getPropertyPath()] = $error->getMessage();
            }
            throw new UnprocessableEntityHttpException(json_encode($messages));
        }

        return $this->json($this->yetiService->create($dto), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        return $this->json($this->yetiService->findById($id));
    }

    #[Route('/{id}/photo', name: 'photo', methods: ['POST'])]
    public function uploadPhoto(int $id, Request $request): JsonResponse
    {
        $file = $request->files->get('photo');
        if ($file === null) {
            throw new BadRequestHttpException('Missing file field "photo".');
        }

        return $this->json($this->yetiService->uploadPhoto($id, $file, $this->uploadsDir));
    }
}
