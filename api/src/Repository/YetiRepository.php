<?php

namespace App\Repository;

use Doctrine\DBAL\ArrayParameterType;
use Doctrine\DBAL\Connection;

class YetiRepository
{
    public function __construct(private readonly Connection $connection) {}

    public function findTopRated(int $limit): array
    {
        return $this->connection->createQueryBuilder()
            ->select('y.*', 'COALESCE(AVG(r.score), 0) AS avg_rating', 'COUNT(r.id) AS rating_count')
            ->from('yeti', 'y')
            ->leftJoin('y', 'rating', 'r', 'r.yeti_id = y.id')
            ->groupBy('y.id')
            ->orderBy('avg_rating', 'DESC')
            ->addOrderBy('rating_count', 'DESC')
            ->setMaxResults($limit)
            ->executeQuery()
            ->fetchAllAssociative();
    }

    public function findRandom(): ?array
    {
        $result = $this->connection
            ->executeQuery('SELECT y.*, COALESCE(AVG(r.score), 0) AS avg_rating, COUNT(r.id) AS rating_count FROM yeti y LEFT JOIN rating r ON r.yeti_id = y.id GROUP BY y.id ORDER BY RAND() LIMIT 1')
            ->fetchAssociative();

        return $result ?: null;
    }

    public function findNextUnratedByUser(int $userId): ?array
    {
        $batch = $this->findUnratedByUser($userId, 1, []);

        return $batch[0] ?? null;
    }

    public function findUnratedByUser(int $userId, int $limit, array $excludeIds): array
    {
        $qb = $this->connection->createQueryBuilder()
            ->select('y.*', 'COALESCE(AVG(r.score), 0) AS avg_rating', 'COUNT(r.id) AS rating_count')
            ->from('yeti', 'y')
            ->leftJoin('y', 'rating', 'r', 'r.yeti_id = y.id')
            ->andWhere('y.id NOT IN (SELECT yeti_id FROM rating WHERE user_id = :userId)')
            ->setParameter('userId', $userId)
            ->groupBy('y.id')
            ->orderBy('rating_count = 0', 'DESC')
            ->addOrderBy('avg_rating', 'DESC')
            ->setMaxResults($limit);

        if ($excludeIds !== []) {
            $qb->andWhere('y.id NOT IN (:excludeIds)')
               ->setParameter('excludeIds', $excludeIds, ArrayParameterType::INTEGER);
        }

        return $qb->executeQuery()->fetchAllAssociative();
    }

    public function findById(int $id): ?array
    {
        $result = $this->connection->createQueryBuilder()
            ->select('y.*', 'COALESCE(AVG(r.score), 0) AS avg_rating', 'COUNT(r.id) AS rating_count')
            ->from('yeti', 'y')
            ->leftJoin('y', 'rating', 'r', 'r.yeti_id = y.id')
            ->where('y.id = :id')
            ->setParameter('id', $id)
            ->groupBy('y.id')
            ->executeQuery()
            ->fetchAssociative();

        return $result ?: null;
    }

    public function insert(array $data): int
    {
        $this->connection->insert('yeti', $data);

        return (int) $this->connection->lastInsertId();
    }

    public function updatePhoto(int $id, string $filename): void
    {
        $this->connection->update('yeti', ['photo' => $filename], ['id' => $id]);
    }

    public function existsById(int $id): bool
    {
        return (bool) $this->connection->createQueryBuilder()
            ->select('COUNT(id)')
            ->from('yeti')
            ->where('id = :id')
            ->setParameter('id', $id)
            ->executeQuery()
            ->fetchOne();
    }
}
