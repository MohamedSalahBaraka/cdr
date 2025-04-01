<?php

require_once __DIR__ . '/../models/Account.php';

class AccountController
{
    public static function create()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['code'])) {
            http_response_code(400);
            echo json_encode(["error" => "Code is required"]);
            return;
        }
        if (!isset($data['category_id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Category is required"]);
            return;
        }
        $account = Account::create($data['code'], $data['category_id']);
        if ($account['status'] == 'error') {
            http_response_code(500);
            # code...
        } else {
            http_response_code(201);
            # code...
        }

        echo json_encode($account);
    }
    public static function getAll()
    {

        // Fetch paginated accounts
        $category_id = isset($_GET['category_id']) ? (int)$_GET['category_id'] : null;
        $accounts = Account::getAll($category_id);
        if ($accounts['status'] == 'error') {
            http_response_code(500);
            # code...
        } else {
            http_response_code(200);
            # code...
        }
        // Return as JSON
        echo json_encode($accounts);
    }
    public static function update($id)
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['code'])) {
            http_response_code(400);
            echo json_encode(["error" => "Code is required"]);
            return;
        }
        if (!isset($data['category_id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Category is required"]);
            return;
        }
        $account = Account::update($id, $data['code'], $data['category_id']);
        if ($account['status'] == 'error') {
            http_response_code(500);
            # code...
        } else {
            http_response_code(201);
            # code...
        }
        echo json_encode($account);
    }

    public static function get()
    {
        // Get pagination parameters from the request (default: page 1, pageSize 10)
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $pageSize = isset($_GET['pageSize']) ? (int)$_GET['pageSize'] : 10;
        $category_id = isset($_GET['category_id']) ? (int)$_GET['category_id'] : null;

        // Fetch paginated accounts
        $accounts = Account::get($category_id, $page, $pageSize);
        if ($accounts['status'] == 'error') {
            http_response_code(500);
            # code...
        } else {
            http_response_code(200);
            # code...
        }
        // Return as JSON
        echo json_encode($accounts);
    }


    public static function delete($id)
    {
        $account =   Account::delete($id);
        if ($account['status'] == 'error') {
            http_response_code(500);
            # code...
        } else {
            http_response_code(204);
            # code...
        }
        // Return as JSON
        echo json_encode($account);
    }
}
