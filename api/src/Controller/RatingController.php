<?php

namespace App\Controller;

use App\DTO\RateYetiDTO;
use App\Service\RatingService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/rating', name: 'rating_')]
class RatingController extends AbstractController
{
    public function __construct(
        private readonly RatingService $ratingService,
        private readonly ValidatorInterface $validator,
    ) {}

    #[Route('/{id}/rate', name: 'rate', methods: ['POST'])]
    public function rate(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        $dto = new RateYetiDTO();
        $dto->score = (int) ($data['score'] ?? 0);

        $errors = $this->validator->validate($dto);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $messages[$error->getPropertyPath()] = $error->getMessage();
            }
            throw new UnprocessableEntityHttpException(json_encode($messages));
        }

        $this->ratingService->rate($id, $dto->score);

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/{id}/skip', name: 'skip', methods: ['POST'])]
    public function skip(int $id): JsonResponse
    {
        $this->ratingService->skip($id);

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
