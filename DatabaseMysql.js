"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = require("mysql2/promise");
const db = (0, promise_1.createPool)({
    host: process.env.HOST || "localhost",
    user: process.env.USER || "root",
    password: process.env.PASSWORD || "",
    database: process.env.DB || "call",
});
process.on("exit", async () => {
    try {
        await db.end();
        console.log("Closed the database connection");
    }
    catch (err) {
        const error = err;
        console.error("Error closing database:", error.message);
    }
});
class Database {
    static async get(query, params = []) {
        try {
            const [rows] = await db.execute(query, params);
            if (rows.length > 0) {
                return rows[0];
            }
            else {
                throw new Error("Not Found");
            }
        }
        catch (err) {
            throw err;
        }
    }
    static async getAllRow(query, whereParams = []) {
        try {
            const [rows] = await db.execute(query, whereParams);
            return rows;
        }
        catch (err) {
            throw err;
        }
    }
    static async getAll(table, customSelect = "*", join = "", where = "", whereParams = []) {
        try {
            let query = `SELECT ${customSelect} FROM ${table} ${join} ${where}`;
            const [rows] = await db.execute(query, whereParams);
            return rows;
        }
        catch (err) {
            throw err;
        }
    }
    static async run(query, params = []) {
        let connection;
        try {
            // Get a connection from the pool
            connection = await db.getConnection();
            // Start the transaction
            await connection.beginTransaction();
            // Execute the query
            await connection.execute(query, params);
            // Commit the transaction
            await connection.commit();
        }
        catch (err) {
            //@ts-ignore
            if (connection) {
                // Rollback the transaction in case of an error
                await connection.rollback();
            }
            throw err;
        }
        finally {
            //@ts-ignore
            if (connection) {
                // Release the connection back to the pool
                connection.release();
            }
        }
    }
    static async getById(id, table, customSelect = "*", join = "") {
        try {
            let query = `SELECT ${customSelect} FROM `;
            query += table;
            query += ` ${join} WHERE ${table}.id = ?`;
            const model = await this.get(query, [id]);
            return model;
        }
        catch (error) {
            throw error;
        }
    }
    static async getByColumn(value, column, table, customSelect = "*", join = "") {
        try {
            const query = `SELECT ${customSelect} FROM ${table} ${join} WHERE ${column} = ?`;
            return await this.get(query, [value]);
        }
        catch (error) {
            throw error;
        }
    }
    static async deleteById(id, table) {
        try {
            const query = `DELETE FROM ${table} WHERE id = ?`;
            await this.run(query, [id]);
        }
        catch (error) {
            throw error;
        }
    }
    static async deleteComplex(table, where, whereParams) {
        try {
            const query = `DELETE FROM ${table} ${where}`;
            await this.run(query, whereParams);
        }
        catch (error) {
            throw error;
        }
    }
    static async deleteByColumn(value, table, column) {
        try {
            const query = `DELETE FROM ${table} WHERE ${column} = ?`;
            await this.run(query, [value]);
        }
        catch (error) {
            throw error;
        }
    }
    static async create(model, table) {
        try {
            const keys = Object.keys(model);
            const values = keys.map((key) => model[key]);
            const placeholders = Array(keys.length).fill("?").join(", ");
            const query = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders})`;
            await this.run(query, values);
        }
        catch (error) {
            throw error;
        }
    }
    static async update(id, model, table) {
        try {
            const keys = Object.keys(model);
            const values = keys.map((key) => model[key]);
            const setClause = keys.map((key) => `${key} = ?`).join(", ");
            const query = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
            await this.run(query, [...values, id]);
        }
        catch (error) {
            throw error;
        }
    }
    static async updateByColumn(value, column, model, table) {
        try {
            const keys = Object.keys(model);
            const values = keys.map((key) => model[key]);
            const setClause = keys.map((key) => `${key} = ?`).join(", ");
            const query = `UPDATE ${table} SET ${setClause} WHERE ${column} = ?`;
            await this.run(query, [...values, value]);
        }
        catch (error) {
            throw error;
        }
    }
    static async search(criteria, table, customSelect = "*", join = "", whereType = "AND") {
        try {
            const conditions = Object.keys(criteria)
                .map((key) => {
                const { value, operator } = criteria[key];
                const conditionOperator = operator === "LIKE" ? "LIKE" : "=";
                return `${key} ${conditionOperator} ?`;
            })
                .join(` ${whereType} `);
            const query = `SELECT ${customSelect} FROM ${table} ${join} WHERE ${conditions}`;
            const values = Object.values(criteria).map((item) => (item.operator === "LIKE" ? `%${item.value}%` : item.value));
            const [rows] = await db.execute(query, values);
            return rows;
        }
        catch (error) {
            throw error;
        }
    }
    static async paginate(page, pageSize, table, customSelect = "*", join = "", where = "", whereParams = []) {
        const offset = (page - 1) * pageSize;
        const query = `SELECT ${customSelect} FROM ${table} ${join} ${where} LIMIT ? OFFSET ?`;
        try {
            const [rows] = await db.execute(query, [...whereParams, pageSize, offset]);
            return rows;
        }
        catch (error) {
            throw error;
        }
    }
    static async count(table, where = "", whereParams = []) {
        const query = `SELECT COUNT(*) as count FROM ${table} ${where}`;
        try {
            const [result] = await db.execute(query, whereParams);
            const resul = result;
            return resul[0].count;
        }
        catch (error) {
            throw error;
        }
    }
    static async bulkUpdate(models, table) {
        try {
            await Promise.all(models.map(async (model) => {
                await this.update(model.id, model.data, table);
            }));
        }
        catch (error) {
            throw error;
        }
    }
    static async bulkInsert(models, table) {
        try {
            await Promise.all(models.map(async (model) => {
                await this.create(model, table);
            }));
        }
        catch (error) {
            throw error;
        }
    }
    static async sum(column, table, where = "") {
        const query = `SELECT SUM(${column}) as total FROM ${table} ${where}`;
        try {
            const [result] = await db.execute(query);
            const resul = result;
            return resul[0].total;
        }
        catch (error) {
            throw error;
        }
    }
    static async AVG(column, table, where = "", whereParams = []) {
        // Ensure the WHERE clause is formatted correctly
        const query = `SELECT AVG(${column}) as average FROM ${table} ${where}`;
        try {
            const [result] = await db.execute(query, whereParams);
            const resul = result;
            return resul[0].average ?? 0; // Return 0 if result is null (no matching rows)
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = Database;
