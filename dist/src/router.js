"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api_1 = __importDefault(require("./routes/api/api"));
const user_1 = __importDefault(require("./routes/api/user"));
const web_1 = __importDefault(require("./routes/web"));
const router = (0, express_1.Router)();
router.use("/api", api_1.default);
router.use("/user", user_1.default);
router.use("/web", web_1.default);
router.get("/", (req, res) => {
    return res.send("Router Principale");
});
exports.default = router;
