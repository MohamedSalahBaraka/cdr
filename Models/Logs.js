"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Tabels_1 = require("../Constants/Tabels");
const Utils_1 = require("../Constants/Utils");
const DataBase_1 = __importDefault(require("../DataBase"));
const Snowflake_1 = __importDefault(require("../Snowflake"));
class Log {
    constructor(id, message, type, data, timestamp) {
        this.message = message;
        this.id = id;
        this.timestamp = timestamp;
        this.data = data;
        this.type = type;
    }
    static async create(type, message, data) {
        try {
            const uniqueId = Snowflake_1.default.nextId();
            await DataBase_1.default.create({ type, timestamp: new Date().toDateString(), id: uniqueId.toString(), message, data: JSON.stringify(data) }, Tabels_1.LOGS_TABLE);
            return uniqueId.toString();
        }
        catch (error) {
            throw error;
        }
    }
    static async update(id, game_id, state_data) {
        try {
            await DataBase_1.default.update(id, { game_id, state_data }, Tabels_1.LOGS_TABLE);
        }
        catch (error) {
            throw error;
        }
    }
    static async getById(id) {
        try {
            const log = await DataBase_1.default.getById(id, Tabels_1.LOGS_TABLE);
            return log;
        }
        catch (error) {
            throw error;
        }
    }
    static async getAll(page) {
        try {
            const logs = await DataBase_1.default.paginate(page, Utils_1.PAGE_SIZE, Tabels_1.LOGS_TABLE);
            const count = await DataBase_1.default.count(Tabels_1.LOGS_TABLE);
            return { logs, pages: Math.ceil(count / Utils_1.PAGE_SIZE) };
        }
        catch (error) {
            throw error;
        }
    }
    static async delete(id) {
        try {
            await DataBase_1.default.deleteById(id, Tabels_1.LOGS_TABLE);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = Log;
