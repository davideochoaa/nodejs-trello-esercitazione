"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
//import { PrismaClient } from '@prisma/client';
const PORT = process.env.PORT;
const connection = server_1.default.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
});
process.on("SIGINT", () => {
    connection.close(() => {
        console.log("Closed Server");
    });
});
