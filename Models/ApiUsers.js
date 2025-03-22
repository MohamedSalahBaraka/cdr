"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DataBase_1 = __importDefault(require("../DataBase"));
const Snowflake_1 = __importDefault(require("../Snowflake"));
const Tabels_1 = require("../Constants/Tabels");
const bcrypt_1 = __importDefault(require("bcrypt"));
class ApiUsers {
    constructor(id, username, created_at, updated_at, password) {
        this.username = username;
        this.id = id;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.password = password;
    }
    static async create(username, password) {
        try {
            const id = Snowflake_1.default.nextId();
            const hashedNewPassword = await bcrypt_1.default.hash(password, 10); // You can adjust the saltRounds as needed
            await DataBase_1.default.create({ username, id, password: hashedNewPassword }, Tabels_1.API_USERS_TABLE);
            return id;
        }
        catch (error) {
            throw error;
        }
    }
    static async update(id, username, password) {
        try {
            const hashedNewPassword = await bcrypt_1.default.hash(password, 10); // You can adjust the saltRounds as needed
            let model = { username, password: hashedNewPassword };
            await DataBase_1.default.update(id, model, Tabels_1.API_USERS_TABLE);
        }
        catch (error) {
            throw error;
        }
    }
    static async getUserByUsername(username) {
        try {
            const user = await DataBase_1.default.getByColumn(username, "username", Tabels_1.API_USERS_TABLE);
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    static async get() {
        try {
            const apiusers = await DataBase_1.default.getAll(Tabels_1.API_USERS_TABLE);
            return apiusers;
        }
        catch (error) {
            throw error;
        }
    }
    static async delete(id) {
        try {
            await DataBase_1.default.deleteById(id, Tabels_1.API_USERS_TABLE);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = ApiUsers;
