import { Router } from "express";
import prisma from "../../prisma";
import express from "express";
import { hashSync, compareSync } from "bcrypt";
import { User } from ".prisma/client"
import { getJwtKeys } from "../../key";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator"


const userRouter = Router();
userRouter.use(express.json());

userRouter.get("/", (req,res) =>{
    return res.send("Rotta del utente")
});

async function verifyEmailAndPassword(email: string, password:string): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    if(!user){
        return null;
    }
    if (!compareSync(password, user.passwordHash)){
        return null;
}
return user
}

function getExpTime(min: number) {
    const now = Math.trunc(new Date().getTime() / 1000);
    return now + min * 60;
}

async function generateJwt(user: User):Promise<string> {
    const payload = {
        aud: 'access',
        exp: getExpTime(2 * 60),
        id: user.id,
        email: user.email,
    }
    const { privateKey } = await getJwtKeys();
    return jwt.sign(payload, privateKey , { algorithm: 'RS256'});
}

userRouter.post("/login",
    body('email').isEmail(),body('password').isString(),
    async (req,res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {privateKey} = await getJwtKeys();
    const {email, password} = req.body;
    const user = await verifyEmailAndPassword(email,password);
    if(!user){
        return res.status(401).send({error: "Invalid Authentication :("})
    }
    const token = await generateJwt(user);
    return res.status(201).send({
        accessToken: token,
    });
});
userRouter.post("/register",
body('email').isEmail(),body('password').isLength({min: 6}),body('name').isString(),async  (req,res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
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