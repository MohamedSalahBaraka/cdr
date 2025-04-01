<?php

require_once __DIR__ . '/../models/User.php';

class UserController
{
    public static function create()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['username'])) {
            http_response_code(400);
            echo json_encode(["error" => "username is required"]);
            return;
        }
        if (!isset($data['password'])) {
            http_response_code(400);
            echo json_encode(["error" => "password is required"]);
            return;
        }
        if (!isset($data['category_id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Category is required"]);
            return;
        }
        $user = User::create($data['username'], $data['password'], $data['category_id'], $data['type']);
        if ($user['status'] == 'error') {
            http_response_code(500);
            # code...
        } else {
            http_response_code(201);
            # code...
        }

        echo json_encode($user);
    }

    public static function login()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['username'])) {
            http_response_code(400);
            echo json_encode(["error" => "username is required"]);
            return;
        }
        if (!isset($data['password'])) {
            http_response_code(400);
            echo json_encode(["error" => "password is required"]);
            return;
        }
        $user = User::login($data['username'], $data['password']);
        if ($user['status'] == 'error') {
            http_response_code(500);
            # code...
        } else {
            http_response_code(201);
            # code...
        }
        echo json_encode($user);
    }
    public static function updateType($id)
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['type'])) {
            http_response_code(400);
            echo json_encode(["error" => "type is required"]);
            return;
        }
        $user = User::updateType($id, $data['type']);
        if ($user['status'] == 'error') {
            http_response_code(500);
            # code...
        } else {
            http_response_code(201);
            # code...
        }
        echo json_encode($user);
    }
    public static function update($id)
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['username'])) {
            http_response_code(400);
            echo json_encode(["error" => "username is required"]);
            return;
        }
        if (!isset($data['category_id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Category is required"]);
            return;
        }
        $user = User::update($id, $data['username'],  $data['category_id'], isset($data['password']) ? $data['password'] : null);
        if ($user['status'] == 'error') {
            http_response_code(500);
            # code...
        } else {
            http_response_code(201);
            # code...
        }
        echo json_encode($user);
    }

    public static function get()
    {
        // Get pagination parameters from the request (default: page 1, pageSize 10)
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $type = isset($_GET['type']) ? (int)$_GET['type'] : 10;
        $pageSize = isset($_GET['pageSize']) ? (int)$_GET['pageSize'] : 10;
        $category_id = isset($_GET['category_id']) ? (int)$_GET['category_id'] : null;

        // Fetch paginated users
        $users = User::get($category_id, $page, $pageSize, $type);
        if ($users['status'] == 'error') {
            http_response_code(500);
            # code...
        } else {
            http_response_code(200);
            # code...
        }
        // Return as JSON
        echo json_encode($users);
    }
    public static function getById($id)
    {
        // Fetch paginated users
        $users = User::getById($id);
        if ($users['status'] == 'error') {
            http_response_code(500);
            # code...
        } else {
            http_response_code(200);
            # code...
        }
        // Return as JSON
        echo json_encode($users);
    }
    public static function getUser()
    {
        $headers = getallheaders();
        $token = explode(" ", $headers['Authorization'])[1] ?? '';
        // Fetch paginated users
        $users = User::getBytoken($token);
        if ($users['status'] == 'error') {
            http_response_code(500);
            # code...
        } else {
            http_response_code(200);
            # code...
        }
        // Return as JSON
        echo json_encode($users);
    }


    public static function delete($id)
    {
        $user =   User::delete($id);
        if ($user['status'] == 'error') {
            http_response_code(500);
            # code...
        } else {
            http_response_code(204);
            # code...
        }
        // Return as JSON
        echo json_encode($user);
    }
}
