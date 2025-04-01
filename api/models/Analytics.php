<?php

require_once __DIR__ . '/../config/database.php';

class Analytics
{
    public static function getDaily($startDate, $accountCode = null, $endDate = null)
    {
        global $pdo;
        try {
            $formattedStartDate = $endDate ? $startDate : "$startDate%";
            $formattedEndDate = $endDate ? "$endDate" : null;
            $queryStart = "WITH date_series AS (
            select call_date from (select adddate('1970-01-01',t4*10000 + t3*1000 + t2*100 + t1*10 + t0) call_date from (select 0 t0 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0, (select 0 t1 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1, (select 0 t2 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2, (select 0 t3 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3, (select 0 t4 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v";
            $queryMid = "),
        daily_stats AS (
            SELECT 
                DATE(start) AS call_date,
                COUNT(uniqueid) AS total_calls,
                COALESCE(SUM(duration), 0) AS total_duration,
                COALESCE(AVG(duration), 0) AS avg_duration,
                COUNT(CASE WHEN disposition = 'ANSWERED' THEN 1 END) AS answered,
                COUNT(CASE WHEN disposition = 'NO ANSWER' THEN 1 END) AS no_answer,
                COUNT(CASE WHEN disposition = 'FAILED' THEN 1 END) AS failed,
                COUNT(CASE WHEN disposition = 'BUSY' THEN 1 END) AS busy,
                (SELECT src FROM cdr_logs WHERE DATE(start) = call_date 
                 GROUP BY src ORDER BY COUNT(*) DESC LIMIT 1) AS most_frequent_caller,
                (SELECT dst FROM cdr_logs WHERE DATE(start) = call_date 
                 GROUP BY dst ORDER BY COUNT(*) DESC LIMIT 1) AS most_called_number,
                (SELECT HOUR(start) FROM cdr_logs WHERE DATE(start) = call_date 
                 GROUP BY HOUR(start) ORDER BY COUNT(*) DESC LIMIT 1) AS busiest_hour
            FROM cdr_logs";
            $queryEnd = "GROUP BY call_date
        )
        SELECT 
            DATE_FORMAT(d.call_date, '%Y-%m-%d') AS label,
            COALESCE(ds.total_calls, 0) AS total_calls,
            COALESCE(ds.answered, 0) AS answered,
            COALESCE(ds.no_answer, 0) AS no_answer,
            COALESCE(ds.failed, 0) AS failed,
            COALESCE(ds.busy, 0) AS busy,
            COALESCE(ds.total_duration, 0) AS total_duration,
            COALESCE(ds.avg_duration, 0) AS avg_duration,
            COALESCE(ds.most_frequent_caller, 'N/A') AS most_frequent_caller,
            COALESCE(ds.most_called_number, 'N/A') AS most_called_number,
            COALESCE(ds.busiest_hour, 'N/A') AS busiest_hour
        FROM date_series d
        LEFT JOIN daily_stats ds ON d.call_date = ds.call_date
        ORDER BY d.call_date;";
            if (!empty($accountCode)) {
                if (empty($endDate)) {
                    $where = "WHERE call_date LIKE :startDate";
                    $srcwhere = "WHERE start LIKE :startDate AND src = :accountcode";
                    $dstwhere = "WHERE start LIKE :startDate  AND dst = :accountcode";
                } else {
                    $where = "WHERE (call_date BETWEEN DATE(:startDate) AND DATE(:endDate))";
                    $srcwhere = "WHERE (start BETWEEN DATE(:startDate) AND DATE(:endDate)) AND dst = :accountcode";
                    $dstwhere = "WHERE (start BETWEEN DATE(:startDate) AND DATE(:endDate)) AND src = :accountcode";
                }

                $src = $pdo->prepare($queryStart . " " . $where . " " . $queryMid . " " . $srcwhere . " " . $queryEnd);
                $dst = $pdo->prepare($queryStart . " " . $where . " " . $queryMid . " " . $dstwhere . " " . $queryEnd);

                $src->bindValue(':accountcode', $accountCode, PDO::PARAM_STR);
                $dst->bindValue(':accountcode', $accountCode, PDO::PARAM_STR);

                $src->bindValue(':startDate', $formattedStartDate, PDO::PARAM_STR);
                if (!empty($endDate)) {
                    $src->bindValue(':endDate', $formattedEndDate, PDO::PARAM_STR);
                    $dst->bindValue(':endDate', $formattedEndDate, PDO::PARAM_STR);
                }
                $dst->bindValue(':startDate', $formattedStartDate, PDO::PARAM_STR);

                $src->execute();
                $dst->execute();

                return [
                    'status' => 'success',
                    'message' => 'Analytics retrieved successfully',
                    'data' => [
                        'src' => $src->fetchAll(PDO::FETCH_ASSOC),
                        'dst' => $dst->fetchAll(PDO::FETCH_ASSOC)
                    ]
                ];
            }

            if (empty($endDate)) {
                $where = "WHERE call_date LIKE :startDate";
                $wherestart = "WHERE start LIKE :startDate";
            } else {
                $where = "WHERE (call_date BETWEEN DATE(:startDate) AND DATE(:endDate))";
                $wherestart = "WHERE (start BETWEEN DATE(:startDate) AND DATE(:endDate))";
            }

            $stmt = $pdo->prepare($queryStart . " " . $where . " " . $queryMid . " " . $wherestart . " " . $queryEnd);

            $stmt->bindValue(':startDate', $formattedStartDate, PDO::PARAM_STR);

            $stmt->execute();

            return [
                'status' => 'success',
                'message' => 'Analytics retrieved successfully',
                'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)
            ];
        } catch (PDOException $e) {
            return ['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()];
        }
    }
    public static function getMonthly($year, $accountCode = null)
    {
        global $pdo;
        $yearformated = "$year-01-01";
        try {
            $queryStart = "WITH month_series AS (
SELECT DATE_FORMAT(DATE_ADD(:yearformated, INTERVAL t.n MONTH), '%Y-%m') AS call_month
FROM (
SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
UNION ALL SELECT 10 UNION ALL SELECT 11
) t
),
monthly_stats AS (
SELECT
DATE_FORMAT(start, '%Y-%m') AS call_month,
COUNT(uniqueid) AS total_calls,
COALESCE(SUM(duration), 0) AS total_duration,
COALESCE(AVG(duration), 0) AS avg_duration,
COUNT(CASE WHEN disposition = 'ANSWERED' THEN 1 END) AS answered,
COUNT(CASE WHEN disposition = 'NO ANSWER' THEN 1 END) AS no_answer,
COUNT(CASE WHEN disposition = 'FAILED' THEN 1 END) AS failed,
COUNT(CASE WHEN disposition = 'BUSY' THEN 1 END) AS busy,
(SELECT src FROM cdr_logs WHERE DATE_FORMAT(start, '%Y-%m') = call_month
GROUP BY src ORDER BY COUNT(*) DESC LIMIT 1) AS most_frequent_caller,
(SELECT dst FROM cdr_logs WHERE DATE_FORMAT(start, '%Y-%m') = call_month
GROUP BY dst ORDER BY COUNT(*) DESC LIMIT 1) AS most_called_number,
(SELECT HOUR(start) FROM cdr_logs WHERE DATE_FORMAT(start, '%Y-%m') = call_month
GROUP BY HOUR(start) ORDER BY COUNT(*) DESC LIMIT 1) AS busiest_hour
FROM cdr_logs
WHERE DATE_FORMAT(start, '%Y') = :year";
            $queryEnd = "
GROUP BY call_month
)
SELECT
m.call_month AS label,
COALESCE(ms.total_calls, 0) AS total_calls,
COALESCE(ms.answered, 0) AS answered,
COALESCE(ms.no_answer, 0) AS no_answer,
COALESCE(ms.failed, 0) AS failed,
COALESCE(ms.busy, 0) AS busy,
COALESCE(ms.total_duration, 0) AS total_duration,
COALESCE(ms.avg_duration, 0) AS avg_duration,
COALESCE(ms.most_frequent_caller, 'N/A') AS most_frequent_caller,
COALESCE(ms.most_called_number, 'N/A') AS most_called_number,
COALESCE(ms.busiest_hour, 'N/A') AS busiest_hour
FROM month_series m
LEFT JOIN monthly_stats ms ON m.call_month = ms.call_month
ORDER BY m.call_month;";

            if (!empty($accountCode)) {
                $srcQuery = $queryStart . " AND src = :accountCode " . $queryEnd;
                $dstQuery = $queryStart . " AND dst = :accountCode " . $queryEnd;

                $srcStmt = $pdo->prepare($srcQuery);
                $dstStmt = $pdo->prepare($dstQuery);

                $srcStmt->bindValue(':yearformated', $yearformated, PDO::PARAM_STR);
                $srcStmt->bindValue(':year', $year, PDO::PARAM_STR);
                $dstStmt->bindValue(':yearformated', $yearformated, PDO::PARAM_STR);
                $dstStmt->bindValue(':year', $year, PDO::PARAM_STR);

                $srcStmt->bindValue(':accountCode', $accountCode, PDO::PARAM_STR);
                $dstStmt->bindValue(':accountCode', $accountCode, PDO::PARAM_STR);

                $srcStmt->execute();
                $dstStmt->execute();

                return [
                    'status' => 'success',
                    'message' => 'Analytics retrieved successfully',
                    'data' => ['src' => $srcStmt->fetchAll(PDO::FETCH_ASSOC), 'dst' => $dstStmt->fetchAll(PDO::FETCH_ASSOC)]
                ];
            } else {
                $stmt = $pdo->prepare($queryStart . $queryEnd);
                $stmt->bindValue(':year', $year, PDO::PARAM_STR);
                $stmt->bindValue(':yearformated', $yearformated, PDO::PARAM_STR);
                $stmt->execute();

                return [
                    'status' => 'success',
                    'message' => 'Analytics retrieved successfully',
                    'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)
                ];
            }
        } catch (PDOException $e) {
            return ['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()];
        }
    }
}
