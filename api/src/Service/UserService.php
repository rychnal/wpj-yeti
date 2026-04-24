<?php

namespace App\Service;

use App\Repository\UserRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class UserService
{
    public function __construct(private readonly UserRepository $userRepository) {}

    public function loginOrRegister(string $email): array
    {
        $user = $this->userRepository->findByEmail($email);

        if ($user === null) {
            $id   = $this->userRepository->insert($email);
            $user = $this->userRepository->findById($id);
        }

        return $user;
    }

    public function findById(int $id): array
    {
        return $this->userRepository->findById($id)
            ?? throw new NotFoundHttpException("User #{$id} not found.");
    }
}
