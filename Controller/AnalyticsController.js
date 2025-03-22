"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// controllers/accountController.ts
const express_1 = require("express");
const Analytics_1 = __importDefault(require("../Models/Analytics"));
const User_1 = __importDefault(require("../Models/User"));
class AnalyticsController {
    static async getMonthlyAnalyticsByAccount(req, res) {
        try {
            const accountcode = req.params.accountcode;
            const date = req.params.date;
            const authHeader = req.headers.authorization || "";
            const user = await User_1.default.getByToken(authHeader);
            if (!user.accounts || !user.accounts.find((a) => a.code == accountcode)) {
                res.status(422).send(new Error("Not allowed"));
                return;
            }
            const accounts = await Analytics_1.default.getMonthlyAnalyticsByAccount(accountcode, date);
            res.json(accounts);
        }
        catch (error) {
            console.error(error);
            res.status(500).send(new Error("Internal Server Error"));
        }
    }
    static async getYearlyAnalyticsByAccount(req, res) {
        try {
            const accountcode = req.params.accountcode;
            const date = req.params.date;
            const authHeader = req.headers.authorization || "";
            const user = await User_1.default.getByToken(authHeader);
            if (!user.accounts || !user.accounts.find((a) => a.code == accountcode)) {
                res.status(422).send(new Error("Not allowed"));
                return;
            }
            const accounts = await Analytics_1.default.getYearlyAnalyticsByAccount(accountcode, date);
            res.json(accounts);
        }
        catch (error) {
            console.error(error);
            res.status(500).send(new Error("Internal Server Error"));
        }
    }
    static async getAllTimeAnalyticsByAccount(req, res) {
        try {
            const accountcode = req.params.accountcode;
            const authHeader = req.headers.authorization || "";
            const user = await User_1.default.getByToken(authHeader);
            if (!user.accounts || !user.accounts.find((a) => a.code == accountcode)) {
                res.status(422).send(new Error("Not allowed"));
                return;
            }
            const accounts = await Analytics_1.default.getAllTimeAnalyticsByAccount(accountcode);
            res.json(accounts);
        }
        catch (error) {
            console.error(error);
            res.status(500).send(new Error("Internal Server Error"));
        }
    }
    static getRouter() {
        const router = (0, express_1.Router)();
        router.get("/getMonthlyAnalyticsByAccount/:accountcode/:date", this.getMonthlyAnalyticsByAccount);
        router.get("/getYearlyAnalyticsByAccount/:accountcode/:date", this.getYearlyAnalyticsByAccount);
        router.get("/getAllTimeAnalyticsByAccount/:accountcode", this.getAllTimeAnalyticsByAccount);
        return router;
    }
}
exports.default = AnalyticsController;
