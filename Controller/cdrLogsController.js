"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// controllers/UserController.ts
const express_1 = require("express");
const Logs_1 = __importDefault(require("../Models/Logs"));
class cdrLogsController {
    static async get(req, res) {
        try {
            await Logs_1.default.create('controller.get', 'check', req.query);
            // await CDRLog.create(CDRLogdata);
            res.status(200).send("Received");
        }
        catch (error) {
            console.error(error);
            if (error === "username already used")
                res.status(422).send(error);
            else
                res.status(500).send("Internal Server Error");
        }
    }
    static async post(req, res) {
        try {
            await Logs_1.default.create('controller.post', 'check', req.body);
            // const CDRLogdata: CDRLog = req.body;
            // await CDRLog.create(CDRLogdata);
            res.status(200).send("Received");
        }
        catch (error) {
            console.error(error);
            if (error === "username already used")
                res.status(422).send(error);
            else
                res.status(500).send("Internal Server Error");
        }
    }
    static async delete(req, res) {
        try {
            await Logs_1.default.create('controller.delete', 'check', req.query);
            // await CDRLog.create(CDRLogdata);
            res.status(200).send("Received");
        }
        catch (error) {
            console.error(error);
            if (error === "username already used")
                res.status(422).send(error);
            else
                res.status(500).send("Internal Server Error");
        }
    }
    static async put(req, res) {
        try {
            await Logs_1.default.create('controller.put', 'check', req.body);
            // const CDRLogdata: CDRLog = req.body;
            // await CDRLog.create(CDRLogdata);
            res.status(200).send("Received");
        }
        catch (error) {
            console.error(error);
            if (error === "username already used")
                res.status(422).send(error);
            else
                res.status(500).send("Internal Server Error");
        }
    }
    static getRouter() {
        const router = (0, express_1.Router)();
        router.post("/", this.post);
        router.put("/", this.put);
        router.get("/", this.get);
        router.delete("/", this.delete);
        return router;
    }
}
exports.default = cdrLogsController;
