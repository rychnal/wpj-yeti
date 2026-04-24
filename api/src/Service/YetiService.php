<?php

namespace App\Service;

use App\DTO\CreateYetiDTO;
use App\Repository\YetiRepository;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class YetiService
{
    public function __construct(private readonly YetiRepository $yetiRepository) {}

    public function getTopRated(int $limit = 10): array
    {
        return $this->yetiRepository->findTopRated($limit);
    }

    public function getRandomMatch(): array
    {
        return $this->yetiRepository->findRandom()
            ?? throw new NotFoundHttpException('No yeti available.');
    }

    public function getMatchForUser(int $userId): array
    {
        return $this->yetiRepository->findNextUnratedByUser($userId)
            ?? throw new NotFoundHttpException('Všechny yeti jsou již ohodnoceni.');
    }

    public function getMatchBatchForUser(int $userId, int $limit, array $excludeIds): array
    {
        return $this->yetiRepository->findUnratedByUser($userId, $limit, $excludeIds);
    }

    public function create(CreateYetiDTO $dto): array
    {
        $id = $this->yetiRepository->insert([
            'name'        => $dto->name,
            'gender'      => $dto->gender,
            'height_cm'   => $dto->heightCm,
            'weight_kg'   => $dto->weightKg,
            'location'    => $dto->location,
            'description' => $dto->description,
            'created_at'  => (new \DateTimeImmutable())->format('Y-m-d H:i:s'),
        ]);

        return $this->yetiRepository->findById($id);
    }

    public function findById(int $id): array
    {
        return $this->yetiRepository->findById($id)
            ?? throw new NotFoundHttpException("Yeti #{$id} not found.");
    }

    public function uploadPhoto(int $id, UploadedFile $file, string $uploadsDir): array
    {
        $this->findById($id);

        $filename = sprintf('%s.%s', bin2hex(random_bytes(8)), $file->guessExtension());
        $file->move($uploadsDir, $filename);

        $this->yetiRepository->updatePhoto($id, $filename);

        return $this->yetiRepository->findById($id);
    }
}
