"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// controllers/accountController.ts
const express_1 = require("express");
const Accounts_1 = __importDefault(require("../Models/Accounts"));
class AccountsController {
    static async create(req, res) {
        try {
            const { code } = req.body;
            const service = await Accounts_1.default.create(code);
            res.status(201).json(service);
        }
        catch (error) {
            console.error(error);
            // @ts-ignore
            res.status(500).send({ error: error.message });
        }
    }
    static async update(req, res) {
        try {
            const id = req.params.id;
            const { code } = req.body;
            const account = await Accounts_1.default.update(id, code);
            res.status(201).json(account);
        }
        catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }
    static async get(req, res) {
        try {
            const accounts = await Accounts_1.default.get();
            res.json(accounts);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
    static async delete(req, res) {
        try {
            const id = req.params.id;
            await Accounts_1.default.delete(id);
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
        router.get("/", this.get);
        router.delete("/:id", this.delete);
        return router;
    }
}
exports.default = AccountsController;
