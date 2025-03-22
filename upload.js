"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// Set up multer storage configuration
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        let extensionArray = file.originalname.split(".");
        let extension = extensionArray[extensionArray.length - 1];
        cb(null, extensionArray[extensionArray.length - 2] + "-" + uniqueSuffix + "." + extension);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
exports.default = upload;
