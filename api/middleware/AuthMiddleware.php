<?php

require_once __DIR__ . '/../models/ApiUsers.php';

class AuthMiddleware
{
    public static function authenticate()
    {
        if (!isset($_SERVER['HTTP_AUTHORIZATION'])) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized"]);
            exit;
        }

        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        if (strpos($authHeader, 'Basic ') !== 0) {
            http_response_code(401);
            echo json_encode(["error" => "Invalid authorization format"]);
            exit;
        }

        // Decode the Base64-encoded credentials
        $base64Credentials = substr($authHeader, 6);
        $credentials = base64_decode($base64Credentials);
        list($username, $password) = explode(':', $credentials, 2);

        if (!$username || !$password) {
            http_response_code(401);
            echo json_encode(["error" => "Invalid credentials"]);
            exit;
        }

        try {
            $userData = ApiUsers::getUserByUsername($username);
            if ($userData['status'] == 'error') throw new Exception($userData['message']);
            $user = $userData['data'];
            if (!$user || !password_verify($password, $user['password'])) {
                http_response_code(401);
                echo json_encode(["error" => "Invalid credentials", 'user' => $user]);
                exit;
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Internal server error", "message" => $e->getMessage()]);
            exit;
        }
    }
}
