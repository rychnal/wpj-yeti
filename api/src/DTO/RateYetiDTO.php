<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class RateYetiDTO
{
    #[Assert\NotNull]
    #[Assert\Range(min: 1, max: 5)]
    public int $score = 0;
}
