import { Router } from "express";
import prisma from "../../prisma";
import express from "express";
import { DashboardService } from "../../service/dashboard-service";
import { getJwtKeys } from "../../key";
import jwt from "jsonwebtoken"
import { body, validationResult } from "express-validator";

const apiRouter = Router();
apiRouter.use(express.json());
const dashboardService = new DashboardService(prisma);

//METODO DI VERIFICA DEL TOKEN (BEARER TOKEN)
export async function verifyToken(header: string): Promise<string | null> {
    if(!header){
        return null;
    }
    const match = /Bearer (.+)/.exec(header);
    if(!match) {
        return null
    }
    const token = match[1];
    const { publicKey } = await getJwtKeys();
    try {
        const data = jwt.verify(token, publicKey, {
            algorithms: ['RS256']
        }) as{id: string};
        return data.id;
    } catch {
        return null;
    }
}

// AUTENTICAZIONE DELL'USER ID IN OGNI METODO 
apiRouter.use(async (req,res, next) => {
    const authHeader = req.headers ['authorization'];
    const userId = await verifyToken(authHeader!);
    if(!userId){
        return res.status(400).send({error: "invalid authentication"})
    }
    res.locals.userId = userId;
    next();
});


apiRouter.get("/", (req,res) =>{
    return res.send("Benvenuto! c:")
});

// METODO POST PER SPOSTARE LE DASHBOARD
// RICHIEDE LA DASHBOARD ID CHE VOGLIAMO SPOSTARE
// RICHIEDE ANCHE UN PARAMETRO PASSATO IN JSON : (DA INSERIRE NEL BODY)
/* 
    {
    "position": 1 // NUOVA POSIZIONE DELLA DASHBOARD
    }
*/
apiRouter.post('/:dashboardId/move',body('position').isInt(), async (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const { position } = req.body;
    const { dashboardId } = req.params!;
    const userId = res.locals.userId;

    const ok = await dashboardService.moveDashboard(userId,dashboardId,position);
    if(!ok) {
        return res.status(401).send({msg: "cannot move dashboard"});
    }
    const dashboards = await dashboardService.getDashboards(userId);
    res.send(dashboards);
})

// METODO POST PER SPOSTARE I CONTENUTI ALL'INTERNO DI UNA DASHBOARD O TRA DASHBOARDS
// RICHIEDE LA DASHBOARD ID DI PROVENIENZE ALL'INTERNO DEL LINK INSIEME ALL'ID DEL CONTENUTO
// RICHIEDE ANCHE UN PARAMETRO PASSATO IN JSON : (DA INSERIRE NEL BODY)
/* ESEMPIO:
    {
	"position" : 0, //POSIZIONE DESIDERATA
	"dashboardId" : "cl3r4bzm50019mkjneqaz4yq0" // //DASHBOARD DOVE VOGLIAMO SPOSTARE IL NOSTRO CONTENUTO
    }
*/
apiRouter.post('/:dashboardId/:contentId/move', body('dashboardId').isString(),body('position').isInt(), async (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const to = req.body as { position: number, dashboardId: string};
    const { dashboardId,contentId } = req.params!;
    const userId = res.locals.userId;

    const ok = await dashboardService.moveContent(userId,contentId, to.position, dashboardId, to.dashboardId);
    if(!ok) {
        return res.status(401).send({msg: "cannot move content"});
    }
    const dashboards = await dashboardService.getDashboards(userId);
    res.send(dashboards);
});

// METODO GET PER ESTRARRE TUTTE LE DASHBOARD DISPONIBILI DI UN DETERMINATO UTENTE
// NON RICHIEDE NULLA
apiRouter.get("/list", async (req,res) => {
    const userId = res.locals.userId;
    const dashboards = await dashboardService.getDashboards(userId);
    res.send(dashboards);
});

// METODO POST PER POTER CREARE UNA DASHBOARD BIANCA, SENZA CONTENUTI
// NON RICHIEDE NULLA 
apiRouter.post("/", body('name').isString(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {name} = req.body;
    const userId = res.locals.userId;
    await dashboardService.createDashboard(userId,name);
    const dashboards = await dashboardService.getDashboards(userId);
    res.send(dashboards);
})

// METODO POST PER POTER CREARE CONTENUTI ALL'INTERNO DI UNA DASHBOARD 
// RICHIEDE LA DASHBOARD ID DELLA DASHBOARD
apiRouter.post("/:dashboardId", body('text').isString(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const userId = res.locals.userId;
    const {dashboardId} = req.params!;
    const { text } = req.body
    await dashboardService.createContent(userId,dashboardId,text);
    const dashboards = await dashboardService.getDashboards(userId);
    res.send(dashboards);
})

// DELETE DI UNA DASHBOARD
// RICHIEDE LA DASHBOARD ID
// NON è POSSIBILE ELIMINARE UNA DASHBOARD CHE CONTIENE CONTENUTI (CARDS)
apiRouter.delete("/:dashboardId", async (req,res) => {
    const userId = res.locals.userId;
    const {dashboardId} = req.params;
    const dashboard = await dashboardService.deleteDashboard(userId,dashboardId);
    if(!dashboard) {
        return res.status(401).send({msg: "cannot delete dashboard"});
    }
    const dashboards = await dashboardService.getDashboards(userId);
    res.send(dashboards);
})

// DELETE DI UN CONTENUTO ALL'INTERNO DI UNA DASHBOARD
//RICHIEDE LA DASHBOARD ID CHE CONTIENE IL CONTENUTO E L'ID DEL CONTENUTO
apiRouter.delete("/:dashboardId/:contentId", async (req,res) => {
    const userId = res.locals.userId;
    const {dashboardId, contentId} = req.params;
    const content = await dashboardService.deleteContent(userId,dashboardId,contentId);
    if(!content) {
        return res.status(401).send({msg: "cannot delete dashboard"});
    }
    const dashboards = await dashboardService.getDashboards(userId);
    res.send(dashboards);
})

export default apiRouter;