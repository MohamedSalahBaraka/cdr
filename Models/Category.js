"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DataBase_1 = __importDefault(require("../DataBase"));
const Snowflake_1 = __importDefault(require("../Snowflake"));
const Tabels_1 = require("../Constants/Tabels");
class Category {
    constructor(id, name) {
        this.name = name;
        this.id = id;
    }
    static async create(name) {
        try {
            const id = Snowflake_1.default.nextId();
            console.log(name);
            await DataBase_1.default.create({ name, id }, Tabels_1.CATEGORY_TABLE);
            return id;
        }
        catch (error) {
            throw error;
        }
    }
    static async update(id, name) {
        try {
            let model = { name };
            await DataBase_1.default.update(id, model, Tabels_1.CATEGORY_TABLE);
        }
        catch (error) {
            throw error;
        }
    }
    static async get() {
        try {
            const apiusers = await DataBase_1.default.getAll(Tabels_1.CATEGORY_TABLE);
            return apiusers;
        }
        catch (error) {
            throw error;
        }
    }
    static async delete(id) {
        try {
            await DataBase_1.default.deleteById(id, Tabels_1.CATEGORY_TABLE);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = Category;
