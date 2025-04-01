<?php

require_once __DIR__ . '/../models/ApiUsers.php';

class ApiUsersController
{
    public static function create()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['username']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode(["error" => "Username and password are required"]);
            return;
        }
        $user = ApiUsers::create($data['username'], $data['password']);
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
        if (!isset($data['username']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode(["error" => "Username and password are required"]);
            return;
        }
        $user = ApiUsers::update($id, $data['username'], $data['password']);
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
        $users = ApiUsers::get();
        if ($users['status'] == 'error') {
            http_response_code(500);
            # code...
        } else {
            http_response_code(200);
            # code...
        }
        echo json_encode($users);
    }

    public static function delete($id)
    {
        $user = ApiUsers::delete($id);
        if ($user['status'] == 'error') {
            http_response_code(500);
            # code...
        } else {
            http_response_code(204);
            # code...
        }
        echo json_encode($user);
    }
}
