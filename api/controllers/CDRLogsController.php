<?php

require_once __DIR__ . '/../models/CDRLog.php';

class CDRLogsController
{
    public static function log()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid request data"]);
            return;
        }

        try {
            CDRLog::create($data);
            http_response_code(200);
            echo json_encode(["message" => "Received"]);
        } catch (Exception $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode(["error" => "Internal Server Error"]);
        }
    }
}
