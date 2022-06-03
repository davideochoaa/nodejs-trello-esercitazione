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
exports.getJwtKeys = void 0;
const crypto_1 = require("crypto");
const prisma_1 = __importDefault(require("./prisma"));
function generateKeys() {
    const keys = (0, crypto_1.generateKeyPairSync)('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        }
    });
    return keys;
}
function getJwtKeys() {
    return __awaiter(this, void 0, void 0, function* () {
        let keys = yield prisma_1.default.jwtKey.findFirst();
        if (!keys) {
            const genKeys = generateKeys();
            keys = yield prisma_1.default.jwtKey.create({
                data: {
                    privateKey: genKeys.privateKey,
                    publicKey: genKeys.publicKey,
                },
            });
        }
        return {
            privateKey: keys.privateKey,
            publicKey: keys.publicKey,
        };
    });
}
exports.getJwtKeys = getJwtKeys;
