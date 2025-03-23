"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// controllers/accountController.ts
const express_1 = require("express");
const Category_1 = __importDefault(require("../Models/Category"));
class CategoriesController {
    static async create(req, res) {
        try {
            const { name } = req.body;
            const service = await Category_1.default.create(name);
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
            const { name } = req.body;
            const account = await Category_1.default.update(id, name);
            res.status(201).json(account);
        }
        catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }
    static async get(req, res) {
        try {
            const category = await Category_1.default.get();
            res.json(category);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
    static async delete(req, res) {
        try {
            const id = req.params.id;
            await Category_1.default.delete(id);
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
exports.default = CategoriesController;
