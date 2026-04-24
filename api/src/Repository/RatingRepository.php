<?php

namespace App\Repository;

use Doctrine\DBAL\Connection;

class RatingRepository
{
    public function __construct(private readonly Connection $connection) {}

    public function hasUserRatedYeti(int $userId, int $yetiId): bool
    {
        return (bool) $this->connection->createQueryBuilder()
            ->select('COUNT(id)')
            ->from('rating')
            ->where('user_id = :userId')
            ->andWhere('yeti_id = :yetiId')
            ->setParameter('userId', $userId)
            ->setParameter('yetiId', $yetiId)
            ->executeQuery()
            ->fetchOne();
    }

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

    public function getAggregatesByPeriod(string $period): array
    {
        return match($period) {
            'day'   => $this->connection->executeQuery(
                'SELECT HOUR(created_at) AS hour,
                        COUNT(id) AS total_ratings,
                        ROUND(AVG(score), 2) AS avg_score,
                        MIN(score) AS min_score, MAX(score) AS max_score
                 FROM rating
                 WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)
                 GROUP BY HOUR(created_at)
                 ORDER BY hour ASC'
            )->fetchAllAssociative(),
            'month' => $this->connection->executeQuery(
                'SELECT YEAR(created_at) AS year, MONTH(created_at) AS month, DAY(created_at) AS day,
                        COUNT(id) AS total_ratings,
                        ROUND(AVG(score), 2) AS avg_score,
                        MIN(score) AS min_score, MAX(score) AS max_score
                 FROM rating
                 WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
                 GROUP BY YEAR(created_at), MONTH(created_at), DAY(created_at)
                 ORDER BY year ASC, month ASC, day ASC'
            )->fetchAllAssociative(),
            default => $this->connection->executeQuery(
                'SELECT YEAR(created_at) AS year, MONTH(created_at) AS month,
                        COUNT(id) AS total_ratings,
                        ROUND(AVG(score), 2) AS avg_score,
                        MIN(score) AS min_score, MAX(score) AS max_score
                 FROM rating
                 WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
                 GROUP BY YEAR(created_at), MONTH(created_at)
                 ORDER BY year ASC, month ASC'
            )->fetchAllAssociative(),
        };
    }

    public function getSummary(?\DateTimeImmutable $since = null): array
    {
        $joinCondition = $since !== null
            ? 'r.yeti_id = y.id AND r.created_at >= :since'
            : 'r.yeti_id = y.id';

        $qb = $this->connection->createQueryBuilder()
            ->select(
                'y.id',
                'y.name',
                'y.location',
                'y.photo',
                'COUNT(r.id) AS total_ratings',
                'COALESCE(ROUND(AVG(r.score), 2), 0) AS avg_score',
            )
            ->from('yeti', 'y')
            ->leftJoin('y', 'rating', 'r', $joinCondition)
            ->groupBy('y.id', 'y.name', 'y.location', 'y.photo')
            ->orderBy('avg_score', 'DESC');

        if ($since !== null) {
            $qb->setParameter('since', $since->format('Y-m-d H:i:s'));
        }

        return $qb->executeQuery()->fetchAllAssociative();
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
