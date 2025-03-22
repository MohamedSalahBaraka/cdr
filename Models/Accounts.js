"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DataBase_1 = __importDefault(require("../DataBase"));
const Snowflake_1 = __importDefault(require("../Snowflake"));
const Tabels_1 = require("../Constants/Tabels");
class Accounts {
    constructor(id, code) {
        this.code = code;
        this.id = id;
    }
    static async create(code) {
        try {
            const id = Snowflake_1.default.nextId();
            await DataBase_1.default.create({ code, id }, Tabels_1.ACCOUNTS_TABLE);
            return id;
        }
        catch (error) {
            throw error;
        }
    }
    static async update(id, code) {
        try {
            let model = { code };
            await DataBase_1.default.update(id, model, Tabels_1.ACCOUNTS_TABLE);
        }
        catch (error) {
            throw error;
        }
    }
    static async get() {
        try {
            const apiusers = await DataBase_1.default.getAll(Tabels_1.ACCOUNTS_TABLE);
            return apiusers;
        }
        catch (error) {
            throw error;
        }
    }
    static async delete(id) {
        try {
            await DataBase_1.default.deleteById(id, Tabels_1.ACCOUNTS_TABLE);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = Accounts;
