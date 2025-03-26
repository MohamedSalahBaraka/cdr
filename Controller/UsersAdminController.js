"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// controllers/UserController.ts
const express_1 = require("express");
const User_1 = __importDefault(require("../Models/User"));
class UsersAdminController {
    static async create(req, res) {
        try {
            const { username, password, type } = req.body;
            const service = await User_1.default.create(username, password, type);
            res.status(201).json(service);
        }
        catch (error) {
            console.error(error);
            if (error === "username already used")
                res.status(422).send(error);
            else
                res.status(500).send("Internal Server Error");
        }
    }
    static async update(req, res) {
        try {
            const id = req.params.id;
            const { password, username, phone } = req.body;
            const user = await User_1.default.updateAdmin(id, password, username);
            res.status(201).json(user);
        }
        catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }
    static async removeAccountFromUser(req, res) {
        try {
            const user_id = req.params.user_id;
            const account_id = req.params.account_id;
            const user = await User_1.default.removeAccountFromUser(user_id, account_id);
            res.status(201).json(user);
        }
        catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }
    static async addingAccountToUser(req, res) {
        try {
            const user_id = req.params.user_id;
            const account_id = req.params.account_id;
            const user = await User_1.default.addingAccountToUser(user_id, account_id);
            res.status(201).json(user);
        }
        catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }
    static async updateType(req, res) {
        try {
            const id = req.params.id;
            const { type } = req.body;
            const user = await User_1.default.updateType(id, type);
            res.status(201).json(user);
        }
        catch (error) {
            console.error(error);
            res.status(500).send(error);
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
            console.log(error);
            // @ts-ignore
            res.status(500).json({ error: error.message });
        }
    }
    static async get(req, res) {
        try {
            const page = req.query.page;
            const p = page;
            const type = req.query.type;
            console.log("we here");
            // @ts-ignore
            const users = await User_1.default.getusers(parseInt(p || "1"), type);
            res.json(users);
        }
        catch (error) {
            console.error(error);
            const e = error;
            res.status(500).json({ error, msg: e.message });
        }
    }
    static async search(req, res) {
        try {
            const keyword = req.params.keyword;
            const page = req.query.page;
            const p = page;
            const users = await User_1.default.search(keyword, parseInt(p || "1"));
            res.json(users);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
    static async delete(req, res) {
        try {
            const id = req.params.id;
            await User_1.default.delete(id);
            res.status(204).send(); // No content on successful deletion
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    static getRouter() {
        const router = (0, express_1.Router)();
        router.post("/", this.create);
        router.put("/:id", this.update);
        router.put("/updateType/:id", this.updateType);
        router.get("/", this.get);
        router.get("/search/:keyword", this.search);
        router.get("/logout", this.logout);
        router.get("/accounts/:user_id/:account_id", this.addingAccountToUser);
        router.delete("/accounts/:user_id/:account_id", this.removeAccountFromUser);
        router.delete("/:id", this.delete);
        return router;
    }
}
exports.default = UsersAdminController;
