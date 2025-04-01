<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/snowflake.php';

class Category
{
    public static function create($name)
    {
        global $pdo;
        try {
            $id = getid();
            $stmt = $pdo->prepare("INSERT INTO categories (id, name) VALUES (:id, :name)");
            $stmt->execute(['id' => $id, 'name' => $name]);

            return [
                'status' => 'success',
                'message' => 'Category created successfully',
                'data' => ['id' => $id, 'name' => $name]
            ];
        } catch (PDOException $e) {
            return ['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()];
        }
    }

    public static function update($id, $name)
    {
        global $pdo;
        try {
            $stmt = $pdo->prepare("UPDATE categories SET name = :name WHERE id = :id");
            $stmt->execute(['id' => $id, 'name' => $name]);

            return [
                'status' => 'success',
                'message' => 'Category updated successfully',
                'data' => ['id' => $id, 'name' => $name]
            ];
        } catch (PDOException $e) {
            return ['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()];
        }
    }

    public static function getAll()
    {
        global $pdo;

        try {

            // Fetch categories with pagination
            $stmt = $pdo->prepare("SELECT * FROM categories");
            $stmt->execute();
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);


            return [
                'status' => 'success',
                'message' => 'Categories retrieved successfully',
                'data' => $categories,
            ];
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => 'Database error: ' . $e->getMessage()
            ];
        }
    }

    public static function get($page = 1, $pageSize = 10)
    {
        global $pdo;

        try {
            // Calculate offset for pagination
            $offset = ($page - 1) * $pageSize;

            // Fetch categories with pagination
            $stmt = $pdo->prepare("SELECT * FROM categories LIMIT :pageSize OFFSET :offset");
            $stmt->bindValue(':pageSize', $pageSize, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Get total number of categories
            $totalStmt = $pdo->query("SELECT COUNT(*) FROM categories");
            $total = $totalStmt->fetchColumn();

            return [
                'status' => 'success',
                'message' => 'Categories retrieved successfully',
                'data' => $categories,
                'total' => (int) $total, // Ensure total is an integer
                'page' => $page,
                'pageSize' => $pageSize,
                'totalPages' => ceil($total / $pageSize)
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
            $stmt = $pdo->prepare("DELETE FROM categories WHERE id = :id");
            $stmt->execute(['id' => $id]);

            return ['status' => 'success', 'message' => 'Category deleted successfully'];
        } catch (PDOException $e) {
            return ['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()];
        }
    }
}
