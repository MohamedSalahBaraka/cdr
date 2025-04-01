<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/snowflake.php';

class Account
{
    public static function create($code, $category_id)
    {
        global $pdo;
        try {
            $id = getid();
            $stmt = $pdo->prepare("INSERT INTO accounts (id, code, category_id) VALUES (:id, :code, :category_id)");
            $stmt->execute(['id' => $id, 'code' => $code, 'category_id' => $category_id]);

            return [
                'status' => 'success',
                'message' => 'Account created successfully',
                'data' => ['id' => $id, 'code' => $code, 'category_id' => $category_id]
            ];
        } catch (PDOException $e) {
            return ['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()];
        }
    }

    public static function update($id, $code, $category_id)
    {
        global $pdo;
        try {
            $stmt = $pdo->prepare("UPDATE accounts SET code = :code, category_id = :category_id WHERE id = :id");
            $stmt->execute(['id' => $id, 'code' => $code, 'category_id' => $category_id]);

            return [
                'status' => 'success',
                'message' => 'Account updated successfully',
                'data' => ['id' => $id, 'code' => $code, 'category_id' => $category_id]
            ];
        } catch (PDOException $e) {
            return ['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()];
        }
    }

    public static function getAll($category_id = null)
    {
        global $pdo;

        try {
            $query = "SELECT * FROM accounts";
            if (!empty($category_id)) {
                $query .= " WHERE category_id = :category_id";
            }
            // Fetch categories with pagination
            $stmt = $pdo->prepare($query);
            if (!empty($category_id)) {
                $stmt->bindValue(':category_id', $category_id, PDO::PARAM_INT);
            }
            $stmt->execute();
            $accounts = $stmt->fetchAll(PDO::FETCH_ASSOC);


            return [
                'status' => 'success',
                'message' => 'Account retrieved successfully',
                'data' => $accounts,
            ];
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => 'Database error: ' . $e->getMessage()
            ];
        }
    }

    public static function get($category_id = null, $page = 1, $pageSize = 10)
    {
        global $pdo;

        try {
            $offset = ($page - 1) * $pageSize;
            $query = "SELECT accounts.*, categories.name FROM accounts left join categories on categories.id = accounts.category_id";
            $countQuery = "SELECT COUNT(*) FROM accounts";

            if (!empty($category_id)) {
                $query .= " WHERE category_id = :category_id";
                $countQuery .= " WHERE category_id = :category_id";
            }

            $query .= " LIMIT :pageSize OFFSET :offset";

            // Prepare and execute the count query
            $countStmt = $pdo->prepare($countQuery);
            if (!empty($category_id)) {
                $countStmt->bindValue(':category_id', $category_id, PDO::PARAM_INT);
            }
            $countStmt->execute();
            $total = (int) $countStmt->fetchColumn(); // Fetch total record count

            // Prepare and execute the data retrieval query
            $stmt = $pdo->prepare($query);
            if (!empty($category_id)) {
                $stmt->bindValue(':category_id', $category_id, PDO::PARAM_INT);
            }
            $stmt->bindValue(':pageSize', $pageSize, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return [
                'status' => 'success',
                'message' => 'Accounts retrieved successfully',
                'data' => $data,
                'total' => $total,
                'page' => $page,
                'pageSize' => $pageSize,
                'totalPages' => ($total > 0) ? ceil($total / $pageSize) : 1
            ];
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => 'Database error: ' . $e->getMessage()
            ];
        }
    }


    public static function delete($id)
    {
        global $pdo;
        try {
            $stmt = $pdo->prepare("DELETE FROM accounts WHERE id = :id");
            $stmt->execute(['id' => $id]);

            return ['status' => 'success', 'message' => 'Account deleted successfully'];
        } catch (PDOException $e) {
            return ['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()];
        }
    }
}
