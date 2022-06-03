import express from "express";
import 'dotenv/config'
import router from "./router";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", express.static(__dirname+"/dist/public")); //permette di ricavare un file statico dalla directory public
app.use("/", router);

export default app; 