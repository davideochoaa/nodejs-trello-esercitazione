import express from "express";
import 'dotenv/config'
import router from "./router";

const app = express();
app.use(express.json());
app.use("/", express.static(__dirname+"/public")); //permette di ricavare un file statico dalla directory public
app.use("/", router);

export default app; 
