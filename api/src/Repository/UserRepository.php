<?php

namespace App\Repository;

use Doctrine\DBAL\Connection;

class UserRepository
{
    public function __construct(private readonly Connection $connection) {}

    public function findByEmail(string $email): ?array
    {
        $result = $this->connection->createQueryBuilder()
            ->select('*')
            ->from('user')
            ->where('email = :email')
            ->setParameter('email', $email)
            ->executeQuery()
            ->fetchAssociative();

        return $result ?: null;
    }

    public function findById(int $id): ?array
    {
        $result = $this->connection->createQueryBuilder()
            ->select('*')
            ->from('user')
            ->where('id = :id')
            ->setParameter('id', $id)
            ->executeQuery()
            ->fetchAssociative();

        return $result ?: null;
    }

    public function insert(string $email): int
    {
        $this->connection->insert('user', [
            'email'      => $email,
            'created_at' => (new \DateTimeImmutable())->format('Y-m-d H:i:s'),
        ]);

        return (int) $this->connection->lastInsertId();
    }
}
