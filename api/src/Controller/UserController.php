<?php

namespace App\Controller;

use App\DTO\LoginDTO;
use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/auth', name: 'auth_')]
class UserController extends AbstractController
{
    public function __construct(
        private readonly UserService $userService,
        private readonly ValidatorInterface $validator,
    ) {}

    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        $dto        = new LoginDTO();
        $dto->email = trim((string) ($data['email'] ?? ''));

        $errors = $this->validator->validate($dto);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $messages[$error->getPropertyPath()] = $error->getMessage();
            }
            throw new UnprocessableEntityHttpException(json_encode($messages));
        }

        return $this->json($this->userService->loginOrRegister($dto->email), Response::HTTP_OK);
    }

    #[Route('/me/{id}', name: 'me', methods: ['GET'])]
    public function me(int $id): JsonResponse
    {
        return $this->json($this->userService->findById($id));
    }
}
