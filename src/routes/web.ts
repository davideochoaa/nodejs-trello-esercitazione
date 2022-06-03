import { Router } from "express";
import userRouter from "./api/user";
import path from "path";

const webRouter= Router();

webRouter.get('/', (req,res) => {
    return res.sendFile(path.join(__dirname, '..//public', 'index.html'));
} )

webRouter.get("/", async (req,res) =>{
    return res.sendFile(path.join(__dirname, "../dist/public"));
});

webRouter.use('/users', userRouter );

export default webRouter;