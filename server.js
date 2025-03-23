"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const node_path_1 = __importDefault(require("node:path"));
const Authrization_1 = require("./middlewares/Authrization");
const cdrLogsController_1 = __importDefault(require("./Controller/cdrLogsController"));
const AccountsController_1 = __importDefault(require("./Controller/AccountsController"));
const UsersController_1 = __importDefault(require("./Controller/UsersController"));
const UsersAdminController_1 = __importDefault(require("./Controller/UsersAdminController"));
const Analytics_1 = __importDefault(require("./Models/Analytics"));
const node_cron_1 = __importDefault(require("node-cron"));
const AnalyticsController_1 = __importDefault(require("./Controller/AnalyticsController"));
const AnalyticsAdminController_1 = __importDefault(require("./Controller/AnalyticsAdminController"));
const ApisUsersController_1 = __importDefault(require("./Controller/ApisUsersController"));
const LoginController_1 = __importDefault(require("./Controller/LoginController"));
const CategoriesController_1 = __importDefault(require("./Controller/CategoriesController"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const PORT = process.env.PORT || 3030;
app.use(express_1.default.json());
// Define a custom middleware function
app.use((0, cors_1.default)());
app.use("/uploads", express_1.default.static("uploads"));
// @ts-ignore
app.use("/api", Authrization_1.auth);
// @ts-ignore
app.use("/admin", Authrization_1.authAdmin);
// @ts-ignore
app.use("/cdr-logs", Authrization_1.usernamePasswordAuth);
app.use("/cdr-logs", cdrLogsController_1.default.getRouter());
app.use("/admin/api-users", ApisUsersController_1.default.getRouter());
app.use("/admin/accounts", AccountsController_1.default.getRouter());
app.use("/api/user", UsersController_1.default.getRouter());
app.use("/admin/user", UsersAdminController_1.default.getRouter());
app.use("/", LoginController_1.default.getRouter());
app.use("/api/analytics", AnalyticsController_1.default.getRouter());
app.use("/admin/analytics", AnalyticsAdminController_1.default.getRouter());
app.use("/admin/categories", CategoriesController_1.default.getRouter());
app.use(express_1.default.static(node_path_1.default.join(__dirname, "build")));
app.get("/*", function (req, res) {
    res.sendFile(node_path_1.default.join(__dirname, "build", "index.html"));
});
node_cron_1.default.schedule("0 0 * * *", () => {
    Analytics_1.default.populateAnalyticsForYesterday();
    console.log("Running scheduled ride cleanup...");
});
server.listen(PORT, () => console.log("Server running on port " + PORT));
