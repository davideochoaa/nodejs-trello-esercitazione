import { Router } from "express";
import apiRouter from "./routes/api/api";
import userRouter from "./routes/api/user";
import webRouter from "./routes/web";
import { verifyToken } from "./routes/api/api"

const router = Router();

router.use("/api", apiRouter);
router.use("/user", userRouter);
router.use("/web", webRouter);

router.get("/", (req,res) =>{
    
    return res.send("Router Principale");
});


export default router;