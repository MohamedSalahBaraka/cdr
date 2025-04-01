<?php

require_once __DIR__ . '/../config/database.php';

class AuthAdmin
{
    public static function verify()
    {
        $headers = getallheaders();
        if (!isset($headers['Authorization'])) {
            http_response_code(401);
            echo json_encode(["message" => "Not authorized"]);
            exit;
        }

        $token = explode(" ", $headers['Authorization'])[1] ?? '';

        global $pdo;
        $stmt = $pdo->prepare("SELECT u.* FROM tokens t JOIN users u ON u.id = t.user_id WHERE t.token = ?");
        $stmt->execute([$token]);
        $user = $stmt->fetch();

        if (!$user || $user['type'] != 0) {
            http_response_code(401);
            echo json_encode(["message" => "Not an Admin", 'user' => $user, "token" => $headers['Authorization']]);
            exit;
        }
    }
    public static function user()
    {
        $headers = getallheaders();
        if (!isset($headers['Authorization'])) {
            http_response_code(401);
            echo json_encode(["message" => "Not authorized"]);
            exit;
        }

        $token = explode(" ", $headers['Authorization'])[1] ?? '';

        global $pdo;
        $stmt = $pdo->prepare("SELECT u.* FROM tokens t JOIN users u ON u.id = t.user_id WHERE t.token = ?");
        $stmt->execute([$token]);
        $user = $stmt->fetch();

        if (!$user) {
            http_response_code(401);
            echo json_encode(["message" => "Not authorized", 'user' => $user, "token" => $headers['Authorization']]);
            exit;
        }
    }
}
