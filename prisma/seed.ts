import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(){
    const user = await prisma.user.create({
        data: {
            email: "ludovico@ludovicononsaspiegare.maledetto",
            name: "Satanello",
            passwordHash: "",
        },
    });

    const user2 = await prisma.user.create({
        data: {
            email: "test@test.tes",
            name: "test",
            passwordHash: "",
        },
    });

    await prisma.dashboard.create({
        data: {
            name: "dashboard 1",
            position: 0,
            userId: user.id,
            contents: {
                create: [
                    {
                    title: "title of content",
                    text:"ciao a tutti",
                    position:0,
                    like: 1
                    },
                    {
                    title: "title of content",
                    text: "ciao a tutti2",
                    position:1, 
                    like: 1
                    },
                ],
            },
        },
    });
    await prisma.dashboard.create({
        data: {
            name: "dashboard 2",
            position: 1,
            userId: user.id,
            contents: {
                create: [
                    {
                    title: "title of content",
                    text:"sono dentro la dashboard 2",
                    position:0,
                    like: 1
                    },
                    {
                    title: "title of content",
                    text: "anche io ma sto sotto, in position 1",
                    position:1, 
                    like: 1
                    },
                ],
            },
        },
    });
    await prisma.dashboard.create({
        data: {
            name: "dashboard 3",
            position: 1,
            userId: user2.id,
            contents: {
                create: [
                    {
                    title: "title of content",
                    text:"sono dentro la dashboard 3",
                    position:0,
                    like: 1,
                    },
                    {
                    title: "title of content",
                    text: "anche io ma sto sotto, in position 1",
                    position:1, 
                    like: 20,
                    },
                ],
            },
        },
    });
}

main()
    .then(() => {
        console.log("ok");
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });