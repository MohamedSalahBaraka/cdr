<?php
header("Access-Control-Allow-Origin: *"); // Allow all origins (change * to your frontend domain if needed)
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Allowed request methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers
header("Access-Control-Allow-Credentials: true"); // Allow credentials if needed

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
header("Content-Type: application/json");
require_once __DIR__ . '/../controllers/AccountController.php';
require_once __DIR__ . '/../controllers/ApiUsersController.php';
require_once __DIR__ . '/../controllers/CDRLogsController.php';
require_once __DIR__ . '/../controllers/AnalyticsController.php';
require_once __DIR__ . '/../controllers/UserController.php';
require_once __DIR__ . '/../controllers/CategoryController.php';
require_once __DIR__ . '/../middleware/AuthAdmin.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

$uriFull = explode('?', trim($_SERVER['REQUEST_URI'], '?'));
$uri = explode('/', trim($uriFull[0], '/'));
$method = $_SERVER['REQUEST_METHOD'];

if ($uri[2] === 'accounts') {
    if ($method === 'POST') {
        AuthAdmin::verify(); // Protect this route
        AccountController::create();
    } elseif ($method === 'PUT' && isset($uri[3])) {
        AuthAdmin::verify(); // Protect this route
        AccountController::update($uri[3]);
    } elseif ($method === 'GET' && isset($uri[3]) && $uri[3] = 'all') {
        AuthAdmin::user(); // Protect this route
        AccountController::getAll();
    } elseif ($method === 'GET') {
        AccountController::get();
    } elseif ($method === 'DELETE' && isset($uri[3])) {
        AuthAdmin::verify(); // Protect this route
        AccountController::delete($uri[3]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Route not found"]);
    }
} elseif ($uri[2] === 'analytics') {
    if ($method === 'GET' && isset($uri[3]) && $uri[3] == 'daliy') {
        AuthAdmin::verify(); // Protect this route
        AnalyticsController::getDaily();
    } elseif ($method === 'GET' && isset($uri[3]) && $uri[3] == 'monthly') {
        AuthAdmin::verify(); // Protect this route
        AnalyticsController::getMonthly();
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Route not found"]);
    }
} elseif ($uri[2] === 'analytics-user') {
    if ($method === 'GET' && isset($uri[3]) && $uri[3] == 'daliy') {
        AuthAdmin::user(); // Protect this route
        AnalyticsController::getDaily();
    } elseif ($method === 'GET' && isset($uri[3]) && $uri[3] == 'monthly') {
        AuthAdmin::user(); // Protect this route
        AnalyticsController::getMonthly();
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Route not found"]);
    }
} elseif ($uri[2] === 'categories') {
    if ($method === 'POST') {
        AuthAdmin::verify(); // Protect this route
        CategoryController::create();
    } elseif ($method === 'PUT' && isset($uri[3])) {
        AuthAdmin::verify(); // Protect this route
        CategoryController::update($uri[3]);
    } elseif ($method === 'GET' && isset($uri[3]) && $uri[3] == 'all') {
        AuthAdmin::verify(); // Protect this route
        CategoryController::getAll();
    } elseif ($method === 'GET') {
        AuthAdmin::verify(); // Protect this route
        CategoryController::get();
    } elseif ($method === 'DELETE' && isset($uri[3])) {
        AuthAdmin::verify(); // Protect this route
        CategoryController::delete($uri[3]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Route not found"]);
    }
} elseif ($uri[2] === 'api-users') {
    if ($method === 'POST') {
        AuthAdmin::verify(); // Protect this route
        ApiUsersController::create();
    } elseif ($method === 'PUT' && isset($uri[3])) {
        AuthAdmin::verify(); // Protect this route
        ApiUsersController::update($uri[3]);
    } elseif ($method === 'GET') {
        AuthAdmin::verify(); // Protect this route
        ApiUsersController::get();
    } elseif ($method === 'DELETE' && isset($uri[3])) {
        AuthAdmin::verify(); // Protect this route
        ApiUsersController::delete($uri[3]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Route not found"]);
    }
} elseif ($uri[2] === 'user') {
    if ($method === 'POST') {
        AuthAdmin::verify(); // Protect this route
        UserController::create();
    } elseif ($method === 'PUT' && isset($uri[3])) {
        AuthAdmin::verify(); // Protect this route
        UserController::update($uri[3]);
    } elseif ($method === 'GET' && isset($uri[3]) && $uri[3] == 'self') {
        AuthAdmin::user(); // Protect this route
        UserController::getUser();
    } elseif ($method === 'GET') {
        AuthAdmin::verify(); // Protect this route
        UserController::get();
    } elseif ($method === 'DELETE' && isset($uri[3])) {
        AuthAdmin::verify(); // Protect this route
        UserController::delete($uri[3]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Route not found"]);
    }
} elseif ($uri[2] === 'login') {
    if ($method === 'POST') {
        // AuthAdmin::verify(); // Protect this route
        UserController::login();
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Route not found"]);
    }
} elseif ($uri[2] === 'cdr-logs') {
    AuthMiddleware::authenticate();

    if ($method === 'POST') {
        CDRLogsController::log();
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Route not found"]);
    }
} else {
    http_response_code(404);
    echo json_encode(["error" => "Route not found", "uri" => $uri]);
}
