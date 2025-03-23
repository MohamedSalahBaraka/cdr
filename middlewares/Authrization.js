"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
exports.auth = auth;
exports.authAdmin = authAdmin;
exports.usernamePasswordAuth = usernamePasswordAuth;
const DataBase_1 = __importDefault(require("../DataBase"));
const User_1 = require("../Models/User");
const Tabels_1 = require("../Constants/Tabels");
const Logs_1 = __importDefault(require("../Models/Logs"));
async function auth(request, response, next) {
    // Log the request method and URL
    const authHeader = request.headers.authorization; // or req.get('authorization')
    if (authHeader) {
        const token = authHeader.split(" ")[1]; // get the token
        try {
            const rows = await DataBase_1.default.getAll("tokens t", "u.* ", `JOIN ${Tabels_1.USER_TABLE} u ON u.id = t.user_id`, "WHERE t.token = ?", [token]);
            const row = rows[0];
            if (row) {
                exports.user = row;
                // if (row.status === userstatus.blocked) return response.status(403).send(new Error("YOU ARE BLOCKED FROM SERVICE"));
                next();
            }
            else {
                // If no, send a 404 not found response
                response.status(401).send({ message: "wrong token" });
            }
        }
        catch (error) {
            return response.status(500).send(error.message);
        }
    }
    else {
        response.status(403).send({ message: "not authorize" });
        // handle the case when there is no authorization header
    }
    // Call the next function in the stack
}
async function authAdmin(request, response, next) {
    // Log the request method and URL
    const authHeader = request.headers.authorization; // or req.get('authorization')
    if (authHeader) {
        const token = authHeader.split(" ")[1]; // get the token
        try {
            const rows = await DataBase_1.default.getAll("tokens t", "u.* ", `JOIN ${Tabels_1.USER_TABLE} u ON u.id = t.user_id`, "WHERE t.token = ?", [token]);
            const row = rows[0];
            if (!row) {
                response.status(401).send({ message: "wrong token" });
                return;
            }
            if (row.type == User_1.userType.admin) {
                exports.user = row;
                // if (row.status === userstatus.blocked) return response.status(403).send(new Error("YOU ARE BLOCKED FROM SERVICE"));
                next();
            }
            else {
                // If no, send a 404 not found response
                response.status(401).send({ message: "not AN Admin" });
            }
        }
        catch (error) {
            return response.status(500).send(error.message);
        }
    }
    else {
        response.status(403).send({ message: "not authorize" });
        // handle the case when there is no authorization header
    }
    // Call the next function in the stack
}
async function usernamePasswordAuth(req, res, next) {
    const auth = req.headers.authorization;
    await Logs_1.default.create('medleware.auth', 'check', auth);
    next();
    // if (!auth || !auth.startsWith("Basic ")) {
    //   return res.status(401).json({ error: "Unauthorized" });
    // }
    // // Decode the Base64-encoded credentials
    // const base64Credentials = auth.split(" ")[1];
    // const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    // const [username, password] = credentials.split(":");
    // if (!username || !password) {
    //   return res.status(401).json({ error: "Invalid authorization format" });
    // }
    // try {
    //   // Query the database for the user
    //   const user = await ApiUsers.getUserByUsername(username); // Adjust this to your DB function
    //   if (!user || (await bcrypt.compare(password, user.password))) {
    //     // Replace this with a hashed password check if needed
    //     return res.status(401).json({ error: "Invalid credentials" });
    //   }
    //   next();
    // } catch (error) {
    //   return res.status(500).json({ error: "Internal server error" });
    // }
}
