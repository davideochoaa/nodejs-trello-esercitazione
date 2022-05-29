import { Router } from "express";
import prisma from "../../prisma";
import express from "express";
import { DashboardService } from "../../service/dashboard-service";
import { getJwtKeys } from "../../key";
import jwt from "jsonwebtoken"
import { Verify } from "crypto";
import { body, validationResult } from "express-validator";

const apiRouter = Router();
apiRouter.use(express.json());
const dashboardService = new DashboardService(prisma);

async function verifyToken(header: string): Promise<string | null> {
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

apiRouter.use(async (req,res, next) => {
    const authHeader = req.headers ['authorization'];
    const userId = await verifyToken(authHeader);
    if(!userId){
        return res.status(400).send({error: "invalid authentication"})
    }
    res.locals.userId = userId;
    next();
});


apiRouter.get("/", (req,res) =>{
    return res.send("Rotta delle API")
});

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

apiRouter.get("/list", async (req,res) => {
    const userId = res.locals.userId;
    const dashboards = await dashboardService.getDashboards(userId);
    res.send(dashboards);
});

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