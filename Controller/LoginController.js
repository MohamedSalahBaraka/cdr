"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// controllers/LoginController.ts
const express_1 = require("express");
const User_1 = __importDefault(require("../Models/User"));
class LoginController {
    static async login(req, res) {
        try {
            const { username, password } = req.body;
            const data = await User_1.default.login(username, password);
            res.json(data);
        }
        catch (error) {
            const err = error;
            console.log(err.message);
            // @ts-ignore
            res.status(500).json({ error: { message: err.message } });
        }
    }
    static getRouter() {
        const router = (0, express_1.Router)();
        router.post("/login", this.login);
        return router;
    }
}
exports.default = LoginController;
