<?php

require_once __DIR__ . '/../models/Category.php';

class CategoryController
{
    public static function create()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['name'])) {
            http_response_code(400);
            echo json_encode(["error" => "name is required"]);
            return;
        }
        $category = Category::create($data['name']);
        if ($category['status'] == 'error') {
            http_response_code(500);
            # code...
        } else {
            http_response_code(201);
            # code...
        }
        echo json_encode($category);
    }

    public static function update($id)
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['name'])) {
            http_response_code(400);
            echo json_encode(["error" => "name is required"]);
            return;
        }
        $category = Category::update($id, $data['name']);
        if ($category['status'] == 'error') {
            http_response_code(500);
            # code...
        } else {
            http_response_code(201);
            # code...
        }
        echo json_encode($category);
    }

    public static function getAll()
    {

        // Fetch paginated categorys
        $categorys = Category::getAll();
        if ($categorys['status'] == 'error') {
            http_response_code(500);
            # code...
        } else {
            http_response_code(200);
            # code...
        }
        // Return as JSON
        echo json_encode($categorys);
    }

    public static function get()
    {
        // Get pagination parameters from the request (default: page 1, pageSize 10)
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $pageSize = isset($_GET['pageSize']) ? (int)$_GET['pageSize'] : 10;

        // Fetch paginated categorys
        $categorys = Category::get($page, $pageSize);
        if ($categorys['status'] == 'error') {
            http_response_code(500);
            # code...
        } else {
            http_response_code(200);
            # code...
        }
        // Return as JSON
        echo json_encode($categorys);
    }


    public static function delete($id)
    {
        $category = Category::delete($id);
        if ($category['status'] == 'error') {
            http_response_code(500);
            # code...
        } else {
            http_response_code(204);
            # code...
        }
        echo json_encode($category);
    }
}
