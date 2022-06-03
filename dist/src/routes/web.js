"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("./api/user"));
const path_1 = __importDefault(require("path"));
const webRouter = (0, express_1.Router)();
webRouter.get('/', (req, res) => {
    return res.sendFile(path_1.default.join(__dirname, '..//public', 'index.html'));
});
webRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.sendFile(path_1.default.join(__dirname, "../dist/public"));
}));
webRouter.use('/users', user_1.default);
exports.default = webRouter;
