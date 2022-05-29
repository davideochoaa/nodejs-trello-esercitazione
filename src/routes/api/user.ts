import { Router } from "express";
import prisma from "../../prisma";
import express from "express";
import { hashSync, compareSync } from "bcrypt";
import { User } from ".prisma/client"


const userRouter = Router();
userRouter.use(express.json());

userRouter.get("/", (req,res) =>{
    return res.send("Rotta del utente")
});


userRouter.post("/login", async (req,res) => {
    const {email, password} = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    if(!user){
        return res.status(401).send({error: "Invalid Authentication :("})
    }
    if (!compareSync(password, user.passwordHash)){
        return res.status(401).send({error: "Invalid Password"})
    }
    return res.status(201).send({
        id: user.id,
        email:user.email,
        name: user.name,
    });
});
userRouter.post("/register",async  (req,res) => {
    const {email, password, name } = req.body;
    const passwordHash = hashSync(password, 10);
    let user: User;
    try{
        user = await prisma.user.create({
        data: {
            email: email,
            name: name,
            passwordHash: passwordHash,
        },
    });
    } catch {
        return res.status(401).send({error: "cannot create user, Try Again! :)"});
    }  
    return res.status(201).send({
        id: user.id,
        email:user.email,
        name: user.name,
    });
});

export default userRouter;