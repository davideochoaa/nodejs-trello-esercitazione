import { Router } from "express";
import apiRouter from "./routes/api/api";
import userRouter from "./routes/api/user";

const router = Router();

router.use("/api", apiRouter);
router.use("/user", userRouter);

router.get("/", (req,res) =>{
    return res.send("Router Principale");
});


export default router;