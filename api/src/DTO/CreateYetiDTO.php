<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class CreateYetiDTO
{
    #[Assert\NotBlank]
    #[Assert\Length(max: 100)]
    public string $name = '';

    #[Assert\NotBlank]
    #[Assert\Choice(choices: ['male', 'female', 'unknown'])]
    public string $gender = 'unknown';

    #[Assert\NotNull]
    #[Assert\Positive]
    public int $heightCm = 0;

    #[Assert\NotNull]
    #[Assert\Positive]
    public int $weightKg = 0;

    #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    public string $location = '';

    public ?string $description = null;
}
