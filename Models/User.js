"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userType = void 0;
const DataBase_1 = __importDefault(require("../DataBase"));
const uuid_1 = require("uuid");
const Snowflake_1 = __importDefault(require("../Snowflake"));
const Tabels_1 = require("../Constants/Tabels");
const Utils_1 = require("../Constants/Utils");
const bcrypt_1 = __importDefault(require("bcrypt"));
var userType;
(function (userType) {
    userType[userType["admin"] = 0] = "admin";
    userType[userType["user"] = 1] = "user";
})(userType || (exports.userType = userType = {}));
class User {
    constructor(id, username, password, created_at, updated_at, type) {
        this.username = username;
        this.password = password;
        this.id = id;
        this.type = type;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
    static async create(username, password, type) {
        try {
            const id = Snowflake_1.default.nextId();
            const hash2 = await bcrypt_1.default.hash(password, 10);
            // Store hash in your password DB.
            await DataBase_1.default.create({ id, username, type, password: hash2 }, Tabels_1.USER_TABLE);
            return id;
        }
        catch (error) {
            throw error;
        }
    }
    static async updateType(id, type = userType.user) {
        try {
            await DataBase_1.default.update(id, { type }, Tabels_1.USER_TABLE);
        }
        catch (error) {
            throw error;
        }
    }
    static async updateAdmin(id, password, username) {
        try {
            const hash2 = await bcrypt_1.default.hash(password, 10);
            let model = { username };
            if (password && password !== "")
                model.password = hash2;
            await DataBase_1.default.update(id, model, Tabels_1.USER_TABLE);
        }
        catch (error) {
            throw error;
        }
    }
    static async removeAccountFromUser(user_id, account_id) {
        try {
            await DataBase_1.default.deleteComplex(Tabels_1.ACCOUNTS_USER_TABLE, "WHERE account_id = ? AND user_id = ?", [account_id, user_id]);
        }
        catch (error) {
            throw error;
        }
    }
    static async addingAccountToUser(user_id, account_id) {
        try {
            await DataBase_1.default.create({ account_id, user_id }, Tabels_1.ACCOUNTS_USER_TABLE);
        }
        catch (error) {
            throw error;
        }
    }
    static async getAccounts(user_id) {
        try {
            const accounts = await DataBase_1.default.getAll(Tabels_1.ACCOUNTS_USER_TABLE, `${Tabels_1.ACCOUNTS_TABLE}.*`, `JOIN ${Tabels_1.ACCOUNTS_TABLE} ON ${Tabels_1.ACCOUNTS_TABLE}.id = ${Tabels_1.ACCOUNTS_USER_TABLE}.account_id`, `WHERE ${Tabels_1.ACCOUNTS_USER_TABLE}.user_id = ?`, [user_id]);
            return accounts;
        }
        catch (error) {
            throw error;
        }
    }
    static async asignUsersToTheirAccounts(users) {
        try {
            return await Promise.all(users.map(async (u) => {
                const accounts = await this.getAccounts(u.id);
                return { ...u, accounts };
            }));
        }
        catch (error) {
            throw error;
        }
    }
    static async search(keyword, page) {
        try {
            let users = await DataBase_1.default.paginate(page, Utils_1.PAGE_SIZE, Tabels_1.USER_TABLE, `*`, ``, `WHERE username LIKE ? `, ["%" + keyword + "%"]);
            const count = await DataBase_1.default.count(Tabels_1.USER_TABLE, ` WHERE username LIKE ? `, ["%" + keyword + "%"]);
            users = await this.asignUsersToTheirAccounts(users);
            return { users, pages: Math.ceil(count / Utils_1.PAGE_SIZE) };
        }
        catch (error) {
            throw error;
        }
    }
    static async getByToken(authHeader) {
        try {
            if (!authHeader)
                throw new Error("no token");
            const token = authHeader.split(" ")[1]; // get the token
            const rows = await DataBase_1.default.getAll("tokens t", "u.* ", `JOIN ${Tabels_1.USER_TABLE} u ON u.id = t.user_id`, "WHERE t.token = ?", [token]);
            const row = rows[0];
            if (row) {
                const accounts = await this.getAccounts(row.id);
                return { ...row, accounts };
            }
            throw new Error("not found");
        }
        catch (error) {
            throw error;
        }
    }
    static async getById(id) {
        try {
            const user = await DataBase_1.default.getById(id, Tabels_1.USER_TABLE);
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    static async getusers(page, type) {
        try {
            let users = await DataBase_1.default.paginate(page, Utils_1.PAGE_SIZE, Tabels_1.USER_TABLE, "*", "", "WHERE type = ?", [type]);
            const count = await DataBase_1.default.count(Tabels_1.USER_TABLE);
            users = await this.asignUsersToTheirAccounts(users);
            return { users, pages: Math.ceil(count / Utils_1.PAGE_SIZE) };
        }
        catch (error) {
            throw error;
        }
    }
    static async delete(id) {
        try {
            await DataBase_1.default.deleteById(id, Tabels_1.USER_TABLE);
        }
        catch (error) {
            throw error;
        }
    }
    static async login(username, password, type) {
        try {
            const rows = await DataBase_1.default.getAll(Tabels_1.USER_TABLE, "*", "", "WHERE username = ?", [username]);
            const row = rows[0];
            if (!row)
                throw new Error("username not found");
            if (type && row.type !== type)
                throw new Error("you are not authrize to use this service");
            const isPasswordValid = await bcrypt_1.default.compare(password, row.password);
            // const isPasswordValid = password === row.password;
            if (isPasswordValid) {
                // Password is correct, generate a token
                const token = (0, uuid_1.v4)();
                // Store the token in the tokens table
                await DataBase_1.default.create({ user_id: row.id, token }, "tokens");
                return { token, user: row };
            }
            else {
                throw new Error("Incorrect password");
            }
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    static async logout(tokenId) {
        try {
            await DataBase_1.default.deleteByColumn(tokenId, "tokens", "token");
            return Promise.resolve();
        }
        catch (err) {
            throw err;
        }
    }
    static async changePassword(userId, oldPassword, newPassword) {
        try {
            // Retrieve the user from the database
            const row = await DataBase_1.default.getById(userId, Tabels_1.USER_TABLE);
            if (!row)
                throw new Error("User not found");
            const isOldPasswordValid = await bcrypt_1.default.compare(oldPassword, row.password);
            // const isOldPasswordValid = oldPassword === row.password;
            console.log(oldPassword, newPassword, row.password);
            if (isOldPasswordValid) {
                // Old password is correct, hash the new password
                const hashedNewPassword = await bcrypt_1.default.hash(newPassword, 10); // You can adjust the saltRounds as needed
                // const hashedNewPassword = newPassword; // You can adjust the saltRounds as needed
                // Update the user's password in the database
                await DataBase_1.default.update(row.id, { password: hashedNewPassword }, Tabels_1.USER_TABLE);
                return Promise.resolve();
            }
            else {
                throw new Error("Old password is incorrect"); // Old password is incorrect
            }
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = User;
