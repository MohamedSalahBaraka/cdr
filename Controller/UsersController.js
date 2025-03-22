"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// controllers/UserController.ts
const express_1 = require("express");
const User_1 = __importDefault(require("../Models/User"));
class UsersController {
    static async ChangePassword(req, res) {
        try {
            const { oldPassword, newPassword } = req.body;
            const authHeader = req.headers.authorization; // or req.get('authorization')
            const userold = await User_1.default.getByToken(authHeader);
            await User_1.default.changePassword(userold.id, oldPassword, newPassword);
            res.status(204).send();
        }
        catch (error) {
            const err = error;
            console.log(err.message);
            // @ts-ignore
            res.status(500).json({ error: { message: err.message } });
        }
    }
    static async get(req, res) {
        try {
            const authHeader = req.headers.authorization || "";
            const user = await User_1.default.getByToken(authHeader);
            res.json(user);
        }
        catch (error) {
            const err = error;
            console.log(err.message);
            // @ts-ignore
            res.status(500).json({ error: { message: err.message } });
        }
    }
    static async logout(req, res) {
        try {
            const authHeader = req.headers.authorization || "";
            const token = authHeader.split(" ")[1];
            await User_1.default.logout(token);
            res.status(204).send();
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
        router.get("/", this.get);
        router.get("/logout", this.logout);
        router.put("/change-password", this.ChangePassword);
        return router;
    }
}
exports.default = UsersController;
