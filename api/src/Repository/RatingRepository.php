<?php

namespace App\Repository;

use Doctrine\DBAL\Connection;

class RatingRepository
{
    public function __construct(private readonly Connection $connection) {}

    public function insert(int $yetiId, int $score, int $userId): void
    {
        $this->connection->insert('rating', [
            'yeti_id'    => $yetiId,
            'user_id'    => $userId,
            'score'      => $score,
            'created_at' => (new \DateTimeImmutable())->format('Y-m-d H:i:s'),
        ]);
    }

    public function getMonthlyAggregates(): array
    {
        return $this->connection->createQueryBuilder()
            ->select(
                'YEAR(r.created_at) AS year',
                'MONTH(r.created_at) AS month',
                'COUNT(r.id) AS total_ratings',
                'ROUND(AVG(r.score), 2) AS avg_score',
                'MIN(r.score) AS min_score',
                'MAX(r.score) AS max_score',
            )
            ->from('rating', 'r')
            ->groupBy('YEAR(r.created_at)', 'MONTH(r.created_at)')
            ->orderBy('year', 'DESC')
            ->addOrderBy('month', 'DESC')
            ->executeQuery()
            ->fetchAllAssociative();
    }

    public function getSummary(): array
    {
        return $this->connection->createQueryBuilder()
            ->select(
                'y.id',
                'y.name',
                'y.location',
                'y.photo',
                'COUNT(r.id) AS total_ratings',
                'COALESCE(ROUND(AVG(r.score), 2), 0) AS avg_score',
            )
            ->from('yeti', 'y')
            ->leftJoin('y', 'rating', 'r', 'r.yeti_id = y.id')
            ->groupBy('y.id', 'y.name', 'y.location', 'y.photo')
            ->orderBy('avg_score', 'DESC')
            ->executeQuery()
            ->fetchAllAssociative();
    }

    public function getUserStats(int $userId): array
    {
        return $this->connection->createQueryBuilder()
            ->select(
                'y.id',
                'y.name',
                'y.location',
                'y.photo',
                'r.score',
                'r.created_at AS rated_at',
            )
            ->from('rating', 'r')
            ->innerJoin('r', 'yeti', 'y', 'y.id = r.yeti_id')
            ->where('r.user_id = :userId')
            ->setParameter('userId', $userId)
            ->orderBy('r.created_at', 'DESC')
            ->executeQuery()
            ->fetchAllAssociative();
    }

    public function getByYetiId(int $id): array
    {
        return $this->connection->createQueryBuilder()
            ->select('*')
            ->from('rating')
            ->where('yeti_id = :id')
            ->setParameter('id', $id)
            ->orderBy('created_at', 'DESC')
            ->executeQuery()
            ->fetchAllAssociative();
    }
}
