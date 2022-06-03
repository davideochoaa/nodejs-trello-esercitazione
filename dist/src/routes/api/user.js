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
const prisma_1 = __importDefault(require("../../prisma"));
const express_2 = __importDefault(require("express"));
const bcrypt_1 = require("bcrypt");
const key_1 = require("../../key");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const userRouter = (0, express_1.Router)();
userRouter.use(express_2.default.json());
userRouter.get("/", (req, res) => {
    return res.send("Rotta del utente");
});
// FUNZIONE CHE VERIFICA L'EMAIL E LA PASSWORD
function verifyEmailAndPassword(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma_1.default.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return null;
        }
        if (!(0, bcrypt_1.compareSync)(password, user.passwordHash)) {
            return null;
        }
        return user;
    });
}
// FUNZIONE CHE SETTA L'EXPIRATION TIME DEL BEAR TOKEN RICHIEDE IN INPUT IL TEMPO IN MINUTI
function getExpTime(min) {
    const now = Math.trunc(new Date().getTime() / 1000);
    return now + min * 60;
}
// FUNZIONE CHE GENERA IL TOKEN CON AL SUO INTERNO L'EXPIRATION TIME
function generateJwt(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = {
            aud: 'access',
            exp: getExpTime(1000 * 60),
            id: user.id,
            email: user.email,
        };
        const { privateKey } = yield (0, key_1.getJwtKeys)();
        return jsonwebtoken_1.default.sign(payload, privateKey, { algorithm: 'RS256' });
    });
}
// METODO POST PER LOGGARE
// RICHIEDE NEL BODY DI INSOMNIA (JSON)
/* ESEMPIO
    {
    "email" : "ginopaoli@gimail.gino",
    "password" : "ginogino"
    }
*/
// COME RISULTATO CI RIPORTERA' A VIDEO IL BEARER TOKEN DA UTILIZZARE
userRouter.post("/login", (0, express_validator_1.body)('email').isEmail(), (0, express_validator_1.body)('password').isString(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { privateKey } = yield (0, key_1.getJwtKeys)();
    const { email, password } = req.body;
    const user = yield verifyEmailAndPassword(email, password);
    if (!user) {
        return res.status(401).send({ error: "Invalid Authentication :(" });
    }
    const token = yield generateJwt(user);
    return res.status(201).send({
        accessToken: token,
    });
}));
// METODO PER REGISTRARE UN NUOVO UTENTE
// RICHIEDE NEL BODY DI INSOMNIA (JSON)
/*
    {
    "email" : "ginopaoli@gimail.gino",
    "password" : "ginogino", //LUNGHEZZA MINIMA DELLA PASSWORD SETTATA A 6
    "name" : "Gino Paoli"
    }
*/
userRouter.post("/register", (0, express_validator_1.body)('email').isEmail(), (0, express_validator_1.body)('password').isLength({ min: 6 }), (0, express_validator_1.body)('name').isString(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, name } = req.body;
    const passwordHash = (0, bcrypt_1.hashSync)(password, 10);
    let user;
    try {
        user = yield prisma_1.default.user.create({
            data: {
                email: email,
                name: name,
                passwordHash: passwordHash,
            },
        });
    }
    catch (_a) {
        return res.status(401).send({ error: "cannot create user, Try Again! :)" });
    }
    return res.status(201).send({
        id: user.id,
        email: user.email,
        name: user.name,
    });
}));
exports.default = userRouter;
