<?php

require_once __DIR__ . '/../models/Analytics.php';

class AnalyticsController
{
    public static function getDaily()
    {
        if (!isset($_GET['startDate'])) {
            http_response_code(400);
            echo json_encode(["error" => "startDate is required"]);
            return;
        }
        $accountCode  = isset($_GET['accountCode']) ? $_GET['accountCode'] : null;
        $endDate  = isset($_GET['endDate ']) ? $_GET['endDate '] : null;
        $startDate = $_GET['startDate'];
        // Fetch paginated users
        $data = Analytics::getDaily($startDate, $accountCode, $endDate);
        if ($data['status'] == 'error') {
            http_response_code(500);
            # code...
        } else {
            http_response_code(200);
            # code...
        }
        // Return as JSON
        echo json_encode($data);
    }
    public static function getMonthly()
    {
        if (!isset($_GET['year'])) {
            http_response_code(400);
            echo json_encode(["error" => "year is required"]);
            return;
        }
        $accountCode  = isset($_GET['accountCode']) ? $_GET['accountCode'] : null;
        $year = $_GET['year'];
        // Fetch paginated users
        $data = Analytics::getMonthly($year, $accountCode);
        if ($data['status'] == 'error') {
            http_response_code(500);
            # code...
        } else {
            http_response_code(200);
            # code...
        }
        // Return as JSON
        echo json_encode($data);
    }
}
