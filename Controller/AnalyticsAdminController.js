"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// controllers/accountController.ts
const express_1 = require("express");
const Analytics_1 = __importDefault(require("../Models/Analytics"));
class AnalyticsAdminController {
    static async getMonthlyAnalytics(req, res) {
        try {
            const date = req.params.date;
            const accounts = await Analytics_1.default.getMonthlyAnalytics(date);
            res.json(accounts);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
    static async getYearlyAnalytics(req, res) {
        try {
            const date = req.params.date;
            const accounts = await Analytics_1.default.getYearlyAnalytics(date);
            res.json(accounts);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
    static async getAllTimeAnalytics(req, res) {
        try {
            const accounts = await Analytics_1.default.getAllTimeAnalytics();
            res.json(accounts);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
    static async getMonthlyAnalyticsByAccount(req, res) {
        try {
            const accountcode = req.params.accountcode;
            const date = req.params.date;
            const accounts = await Analytics_1.default.getMonthlyAnalyticsByAccount(date, accountcode);
            res.json(accounts);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
    static async getYearlyAnalyticsByAccount(req, res) {
        try {
            const accountcode = req.params.accountcode;
            const date = req.params.date;
            const accounts = await Analytics_1.default.getYearlyAnalyticsByAccount(date, accountcode);
            res.json(accounts);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
    static async getAllTimeAnalyticsByAccount(req, res) {
        try {
            const accountcode = req.params.accountcode;
            const accounts = await Analytics_1.default.getAllTimeAnalyticsByAccount(accountcode);
            res.json(accounts);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
    static async getTodayAnalytics(req, res) {
        try {
            const accounts = await Analytics_1.default.getTodayAnalytics();
            res.json(accounts);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
    static async getTodayAnalyticsByAccount(req, res) {
        try {
            const accountcode = req.params.accountcode;
            const accounts = await Analytics_1.default.getTodayAnalyticsByAccount(accountcode);
            res.json(accounts);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
    static async getAnalyticsByDateRangeAndAccountCode(req, res) {
        try {
            const accountcode = req.params.accountcode;
            const startDate = req.params.startDate;
            const endDate = req.params.endDate;
            const accounts = await Analytics_1.default.getAnalyticsByDateRangeAndAccountCode(startDate, endDate, accountcode);
            res.json(accounts);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
    static async getAnalyticsByDateRange(req, res) {
        try {
            const startDate = req.params.startDate;
            const endDate = req.params.endDate;
            const accounts = await Analytics_1.default.getAnalyticsByDateRange(startDate, endDate);
            res.json(accounts);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
    static getRouter() {
        const router = (0, express_1.Router)();
        router.get("/getMonthlyAnalytics/:date", this.getMonthlyAnalytics);
        router.get("/getYearlyAnalytics/:date", this.getYearlyAnalytics);
        router.get("/getTodayAnalytics", this.getTodayAnalytics);
        router.get("/getAllTimeAnalytics", this.getAllTimeAnalytics);
        router.get("/getMonthlyAnalyticsByAccount/:accountcode/:date", this.getMonthlyAnalyticsByAccount);
        router.get("/getYearlyAnalyticsByAccount/:accountcode/:date", this.getYearlyAnalyticsByAccount);
        router.get("/getAllTimeAnalyticsByAccount/:accountcode", this.getAllTimeAnalyticsByAccount);
        router.get("/getTodayAnalyticsByAccount/:accountcode", this.getTodayAnalyticsByAccount);
        router.get("/getAnalyticsByDateRangeAndAccountCode/:startDate/:endDate/:accountcode", this.getAnalyticsByDateRangeAndAccountCode);
        router.get("/getAnalyticsByDateRange/:startDate/:endDate", this.getAnalyticsByDateRange);
        return router;
    }
}
exports.default = AnalyticsAdminController;
