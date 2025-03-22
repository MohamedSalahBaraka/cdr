"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// controllers/UserController.ts
const express_1 = require("express");
const CDRLog_1 = __importDefault(require("../Models/CDRLog"));
class cdrLogsController {
    static async log(req, res) {
        try {
            const CDRLogdata = req.body;
            await CDRLog_1.default.create(CDRLogdata);
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
        router.post("/", this.log);
        return router;
    }
}
exports.default = cdrLogsController;
