"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.user.create({
            data: {
                email: "ludovico@ludovicononsaspiegare.maledetto",
                name: "Satanello",
                passwordHash: "",
            },
        });
        const user2 = yield prisma.user.create({
            data: {
                email: "test@test.tes",
                name: "test",
                passwordHash: "",
            },
        });
        yield prisma.dashboard.create({
            data: {
                name: "dashboard 1",
                position: 0,
                userId: user.id,
                contents: {
                    create: [
                        {
                            title: "title of content",
                            text: "ciao a tutti",
                            position: 0,
                            like: 1
                        },
                        {
                            title: "title of content",
                            text: "ciao a tutti2",
                            position: 1,
                            like: 1
                        },
                    ],
                },
            },
        });
        yield prisma.dashboard.create({
            data: {
                name: "dashboard 2",
                position: 1,
                userId: user.id,
                contents: {
                    create: [
                        {
                            title: "title of content",
                            text: "sono dentro la dashboard 2",
                            position: 0,
                            like: 1
                        },
                        {
                            title: "title of content",
                            text: "anche io ma sto sotto, in position 1",
                            position: 1,
                            like: 1
                        },
                    ],
                },
            },
        });
        yield prisma.dashboard.create({
            data: {
                name: "dashboard 3",
                position: 1,
                userId: user2.id,
                contents: {
                    create: [
                        {
                            title: "title of content",
                            text: "sono dentro la dashboard 3",
                            position: 0,
                            like: 1,
                        },
                        {
                            title: "title of content",
                            text: "anche io ma sto sotto, in position 1",
                            position: 1,
                            like: 20,
                        },
                    ],
                },
            },
        });
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
