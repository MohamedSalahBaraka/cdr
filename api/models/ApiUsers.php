<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/snowflake.php';

class ApiUsers
{
    public static function create($username, $password)
    {
        global $pdo;
        try {
            $id = getid();
            $stmt = $pdo->prepare("INSERT INTO users_api (id, username, password, created_at, updated_at) VALUES (:id, :username, :password, NOW(), NOW())");
            $stmt->execute(['id' => $id, 'username' => $username, 'password' => password_hash($password, PASSWORD_BCRYPT)]);

            return [
                'status' => 'success',
                'message' => 'User created successfully',
                'data' => ['id' => $id, 'username' => $username]
            ];
        } catch (PDOException $e) {
            return ['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()];
        }
    }

    public static function update($id, $username, $password)
    {
        global $pdo;
        try {
            if ($password !== "") {
                $stmt = $pdo->prepare("UPDATE users_api SET username = :username, password = :password, updated_at = NOW() WHERE id = :id");
                $stmt->execute(['id' => $id, 'username' => $username, 'password' => password_hash($password, PASSWORD_BCRYPT)]);
            } else {
                $stmt = $pdo->prepare("UPDATE users_api SET username = :username, updated_at = NOW() WHERE id = :id");
                $stmt->execute(['id' => $id, 'username' => $username]);
            }
            return [
                'status' => 'success',
                'message' => 'User updated successfully',
                'data' => ['id' => $id, 'username' => $username]
            ];
        } catch (PDOException $e) {
            return ['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()];
        }
    }
    public static function get($page = 1, $pageSize = 10)
    {
        global $pdo;

        try {
            // Calculate offset for pagination
            $offset = ($page - 1) * $pageSize;

            // Get the total number of users
            $totalStmt = $pdo->query("SELECT COUNT(*) FROM users_api");
            $total = (int) $totalStmt->fetchColumn();

            // Fetch paginated user data
            $stmt = $pdo->prepare("SELECT id, username, created_at, updated_at FROM users_api LIMIT :pageSize OFFSET :offset");
            $stmt->bindValue(':pageSize', $pageSize, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return [
                'status' => 'success',
                'message' => 'Users retrieved successfully',
                'data' => $users,
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
            $stmt = $pdo->prepare("DELETE FROM users_api WHERE id = :id");
            $stmt->execute(['id' => $id]);

            return ['status' => 'success', 'message' => 'User deleted successfully'];
        } catch (PDOException $e) {
            return ['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()];
        }
    }

    public static function getUserByUsername($username)
    {
        global $pdo;
        try {
            $stmt = $pdo->prepare("SELECT * FROM users_api WHERE username = :username");
            $stmt->execute(['username' => $username]);

            return [
                'status' => 'success',
                'message' => 'User retrieved successfully',
                'data' => $stmt->fetch(PDO::FETCH_ASSOC)
            ];
        } catch (PDOException $e) {
            return ['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()];
        }
    }
}
