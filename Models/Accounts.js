"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DataBase_1 = __importDefault(require("../DataBase"));
const Snowflake_1 = __importDefault(require("../Snowflake"));
const Tabels_1 = require("../Constants/Tabels");
class Accounts {
    constructor(id, code, category_id) {
        this.code = code;
        this.id = id;
        this.category_id = category_id;
    }
    static async create(code, category_id) {
        try {
            const id = Snowflake_1.default.nextId();
            await DataBase_1.default.create({ code, id, category_id }, Tabels_1.ACCOUNTS_TABLE);
            return id;
        }
        catch (error) {
            throw error;
        }
    }
    static async update(id, code, category_id) {
        try {
            let model = { code, category_id };
            await DataBase_1.default.update(id, model, Tabels_1.ACCOUNTS_TABLE);
        }
        catch (error) {
            throw error;
        }
    }
    static async get() {
        try {
            const apiusers = await DataBase_1.default.getAll(Tabels_1.ACCOUNTS_TABLE, `${Tabels_1.CATEGORY_TABLE}.name, ${Tabels_1.ACCOUNTS_TABLE}.*`, `JOIN ${Tabels_1.CATEGORY_TABLE} on ${Tabels_1.CATEGORY_TABLE}.id = ${Tabels_1.ACCOUNTS_TABLE}.category_id `);
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
