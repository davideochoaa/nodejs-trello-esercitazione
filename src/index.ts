import app from "./server";
//import { PrismaClient } from '@prisma/client';

const PORT = process.env.PORT

const connection = app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
});

process.on("SIGINT", () =>{ //Messaggio di chiusura al termine del server
    connection.close(() =>{
        console.log("Closed Server");
    })
});