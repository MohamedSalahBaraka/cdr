<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/snowflake.php';

class User
{
    public static function create($username, $password, $category_id, $type = 1)
    {
        global $pdo;
        try {
            $id = getid();
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $pdo->prepare("INSERT INTO users (id, username, password, type, category_id, created_at, updated_at) VALUES (:id, :username, :password, :type, :category_id, NOW(), NOW())");
            $stmt->execute([
                'id' => $id,
                'username' => $username,
                'password' => $hashedPassword,
                'type' => $type,
                'category_id' => $category_id
            ]);
            return [
                'status' => 'success',
                'message' => 'User created successfully',
                'data' => ['id' => $id, 'username' => $username]
            ];
        } catch (PDOException $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    public static function updateType($id, $type = 1)
    {
        global $pdo;
        try {
            $stmt = $pdo->prepare("UPDATE users SET type = :type, updated_at = NOW() WHERE id = :id");
            $stmt->execute(['id' => $id, 'type' => $type]);
            return [
                'status' => 'success',
                'message' => 'type updated successfully',
                'data' => ['id' => $id, 'type' => $type]
            ];
        } catch (PDOException $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
    public static function update($id, $username, $category_id, $password = null)
    {
        global $pdo;
        try {
            $query = "UPDATE users SET username = :username, category_id = :category_id";
            if (!empty($password)) {
                $query .= ", password = :password";
            }
            $query .= " WHERE id = :id";

            $stmt = $pdo->prepare($query);

            $stmt->bindValue(':username', $username, PDO::PARAM_INT);
            $stmt->bindValue(':category_id', $category_id, PDO::PARAM_INT);
            if (!empty($password)) {
                $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
                $stmt->bindValue(':password', $hashedPassword, PDO::PARAM_INT);
            }
            $stmt->execute();

            return [
                'status' => 'success',
                'message' => 'User updated successfully',
                'data' => ['id' => $id, 'username' => $username, 'password' => $hashedPassword, 'category_id' => $category_id]
            ];
        } catch (PDOException $e) {
            return ['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()];
        }
    }

    public static function get($category_id = null, $page = 1, $pageSize = 10, $type = 0)
    {
        global $pdo;

        try {
            $offset = ($page - 1) * $pageSize;
            $query = "SELECT * FROM users WHERE type = :type";
            $countQuery = "SELECT COUNT(*) FROM users WHERE type = :type";

            if (!empty($category_id)) {
                $query .= " AND category_id = :category_id";
                $countQuery .= " AND category_id = :category_id";
            }

            $query .= " LIMIT :pageSize OFFSET :offset";

            // Prepare and execute the count query
            $countStmt = $pdo->prepare($countQuery);
            $countStmt->bindValue(':type', $type, PDO::PARAM_INT);
            if (!empty($category_id)) {
                $countStmt->bindValue(':category_id', $category_id, PDO::PARAM_INT);
            }
            $countStmt->execute();
            $total = (int) $countStmt->fetchColumn(); // Fetch total record count

            // Prepare and execute the data retrieval query
            $stmt = $pdo->prepare($query);
            $stmt->bindValue(':type', $type, PDO::PARAM_INT);
            if (!empty($category_id)) {
                $stmt->bindValue(':category_id', $category_id, PDO::PARAM_INT);
            }
            $stmt->bindValue(':pageSize', $pageSize, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return [
                'status' => 'success',
                'message' => 'Users retrieved successfully',
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
            $stmt = $pdo->prepare("DELETE FROM users WHERE id = :id");
            $stmt->execute(['id' => $id]);
            return ['status' => 'success', 'message' => 'User deleted successfully'];
        } catch (PDOException $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    public static function getBytoken($token)
    {
        global $pdo;
        try {
            $stmt = $pdo->prepare("SELECT u.* FROM tokens t JOIN users u ON u.id = t.user_id WHERE t.token = ?");
            $stmt->execute([$token]);
            return ['status' => 'success', 'message' => 'User selected successfully', 'data' => $stmt->fetch(PDO::FETCH_ASSOC)];
        } catch (PDOException $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
    public static function getById($id)
    {
        global $pdo;
        try {
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
            $stmt->execute(['id' => $id]);
            return ['status' => 'success', 'message' => 'User selected successfully', 'data' => $stmt->fetch(PDO::FETCH_ASSOC)];
        } catch (PDOException $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    public static function login($username, $password)
    {
        global $pdo;
        try {
            $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username");
            $stmt->execute(['username' => $username]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password'])) {
                $token = bin2hex(random_bytes(16));
                $stmt = $pdo->prepare("INSERT INTO tokens (user_id, token) VALUES (:user_id, :token)");
                $stmt->execute(['user_id' => $user['id'], 'token' => $token]);
                return ['status' => 'success', 'message' => 'Login successfull', 'data' => ['token' => $token, 'user' => $user]];
            }
            return ['status' => 'error', 'message' => 'Invalid credentials'];
        } catch (PDOException $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
}
