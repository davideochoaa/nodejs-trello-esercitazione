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
exports.verifyToken = void 0;
const express_1 = require("express");
const prisma_1 = __importDefault(require("../../prisma"));
const express_2 = __importDefault(require("express"));
const dashboard_service_1 = require("../../service/dashboard-service");
const key_1 = require("../../key");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const apiRouter = (0, express_1.Router)();
apiRouter.use(express_2.default.json());
const dashboardService = new dashboard_service_1.DashboardService(prisma_1.default);
//METODO DI VERIFICA DEL TOKEN (BEARER TOKEN)
function verifyToken(header) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!header) {
            return null;
        }
        const match = /Bearer (.+)/.exec(header);
        if (!match) {
            return null;
        }
        const token = match[1];
        const { publicKey } = yield (0, key_1.getJwtKeys)();
        try {
            const data = jsonwebtoken_1.default.verify(token, publicKey, {
                algorithms: ['RS256']
            });
            return data.id;
        }
        catch (_a) {
            return null;
        }
    });
}
exports.verifyToken = verifyToken;
// AUTENTICAZIONE DELL'USER ID IN OGNI METODO 
apiRouter.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const userId = yield verifyToken(authHeader);
    if (!userId) {
        return res.status(400).send({ error: "invalid authentication" });
    }
    res.locals.userId = userId;
    next();
}));
apiRouter.get("/", (req, res) => {
    return res.send("Benvenuto! c:");
});
// METODO POST PER SPOSTARE LE DASHBOARD
// RICHIEDE LA DASHBOARD ID CHE VOGLIAMO SPOSTARE
// RICHIEDE ANCHE UN PARAMETRO PASSATO IN JSON : (DA INSERIRE NEL BODY)
/*
    {
    "position": 1 // NUOVA POSIZIONE DELLA DASHBOARD
    }
*/
apiRouter.post('/:dashboardId/move', (0, express_validator_1.body)('position').isInt(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { position } = req.body;
    const { dashboardId } = req.params;
    const userId = res.locals.userId;
    const ok = yield dashboardService.moveDashboard(userId, dashboardId, position);
    if (!ok) {
        return res.status(401).send({ msg: "cannot move dashboard" });
    }
    const dashboards = yield dashboardService.getDashboards(userId);
    res.send(dashboards);
}));
// METODO POST PER SPOSTARE I CONTENUTI ALL'INTERNO DI UNA DASHBOARD O TRA DASHBOARDS
// RICHIEDE LA DASHBOARD ID DI PROVENIENZE ALL'INTERNO DEL LINK INSIEME ALL'ID DEL CONTENUTO
// RICHIEDE ANCHE UN PARAMETRO PASSATO IN JSON : (DA INSERIRE NEL BODY)
/* ESEMPIO:
    {
    "position" : 0, //POSIZIONE DESIDERATA
    "dashboardId" : "cl3r4bzm50019mkjneqaz4yq0" // //DASHBOARD DOVE VOGLIAMO SPOSTARE IL NOSTRO CONTENUTO
    }
*/
apiRouter.post('/:dashboardId/:contentId/move', (0, express_validator_1.body)('dashboardId').isString(), (0, express_validator_1.body)('position').isInt(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const to = req.body;
    const { dashboardId, contentId } = req.params;
    const userId = res.locals.userId;
    const ok = yield dashboardService.moveContent(userId, contentId, to.position, dashboardId, to.dashboardId);
    if (!ok) {
        return res.status(401).send({ msg: "cannot move content" });
    }
    const dashboards = yield dashboardService.getDashboards(userId);
    res.send(dashboards);
}));
// METODO GET PER ESTRARRE TUTTE LE DASHBOARD DISPONIBILI DI UN DETERMINATO UTENTE
// NON RICHIEDE NULLA
apiRouter.get("/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.userId;
    const dashboards = yield dashboardService.getDashboards(userId);
    res.send(dashboards);
}));
// METODO POST PER POTER CREARE UNA DASHBOARD BIANCA, SENZA CONTENUTI
// NON RICHIEDE NULLA 
apiRouter.post("/", (0, express_validator_1.body)('name').isString(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name } = req.body;
    const userId = res.locals.userId;
    yield dashboardService.createDashboard(userId, name);
    const dashboards = yield dashboardService.getDashboards(userId);
    res.send(dashboards);
}));
// METODO POST PER POTER CREARE CONTENUTI ALL'INTERNO DI UNA DASHBOARD 
// RICHIEDE LA DASHBOARD ID DELLA DASHBOARD
apiRouter.post("/:dashboardId", (0, express_validator_1.body)('text').isString(), (0, express_validator_1.body)('title').isString(), (0, express_validator_1.body)('img').isString(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const userId = res.locals.userId;
    const { dashboardId } = req.params;
    const { text, title, img } = req.body;
    yield dashboardService.createContent(userId, dashboardId, text, title, img);
    const dashboards = yield dashboardService.getDashboards(userId);
    res.send(dashboards);
}));
//CREAZIONE DI UN COMMENTO
apiRouter.post("/:dashboardId/:contentsId", (0, express_validator_1.body)('text').isString(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const userId = res.locals.userId;
    const { contentsId, dashboardId } = req.params;
    const { text } = req.body;
    yield dashboardService.createComment(userId, contentsId, text, dashboardId);
    const dashboards = yield dashboardService.getDashboards(userId);
    res.send(dashboards);
}));
apiRouter.put("/likeOnComment/:commentId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    const gino = yield dashboardService.putLikeOnComment(commentId);
    res.send(gino);
}));
apiRouter.put("/likeOnContent/:contentId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contentId } = req.params;
    const gino = yield dashboardService.putLikeOnContent(contentId);
    res.send(gino);
}));
apiRouter.put("/dislikeOnContent/:contentId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contentId } = req.params;
    const gino = yield dashboardService.leaveLikeOnContent(contentId);
    res.send(gino);
}));
// DELETE DI UNA DASHBOARD
// RICHIEDE LA DASHBOARD ID
// NON è POSSIBILE ELIMINARE UNA DASHBOARD CHE CONTIENE CONTENUTI (CARDS)
apiRouter.delete("/:dashboardId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.userId;
    const { dashboardId } = req.params;
    const dashboard = yield dashboardService.deleteDashboard(userId, dashboardId);
    if (!dashboard) {
        return res.status(401).send({ msg: "cannot delete dashboard" });
    }
    const dashboards = yield dashboardService.getDashboards(userId);
    res.send(dashboards);
}));
// DELETE DI UN CONTENUTO ALL'INTERNO DI UNA DASHBOARD
//RICHIEDE LA DASHBOARD ID CHE CONTIENE IL CONTENUTO E L'ID DEL CONTENUTO
apiRouter.delete("/:dashboardId/:contentId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.userId;
    const { dashboardId, contentId } = req.params;
    const content = yield dashboardService.deleteContent(userId, dashboardId, contentId);
    if (!content) {
        return res.status(401).send({ msg: "cannot delete dashboard" });
    }
    const dashboards = yield dashboardService.getDashboards(userId);
    res.send(dashboards);
}));
exports.default = apiRouter;
