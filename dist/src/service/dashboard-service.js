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
exports.DashboardService = void 0;
class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    moveDashboard(userId, dashboardId, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const dashboards = yield this.prisma.dashboard.findMany({
                where: {
                    userId: userId,
                },
                orderBy: {
                    position: 'asc',
                },
            });
            if (position >= dashboards.length) {
                return false;
            }
            //@ts-ignore
            const oldPosition = dashboards.findIndex((d) => d.id === dashboardId);
            if (oldPosition === -1) {
                return false;
            }
            const [dashboard] = dashboards.splice(oldPosition, 1);
            dashboards.splice(position, 0, dashboard);
            yield this.reorderDashboard(dashboards);
            return true;
        });
    }
    getDashboards(userId) {
        return this.prisma.dashboard.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                position: 'asc',
            },
            include: {
                contents: {
                    orderBy: {
                        position: 'asc',
                    },
                },
            },
        });
    }
    reorderDashboard(dashboards) {
        return __awaiter(this, void 0, void 0, function* () {
            const updates = dashboards.map((dashboard, position) => {
                return this.prisma.dashboard.update({
                    where: {
                        id: dashboard.id,
                    },
                    data: {
                        position: position,
                    },
                });
            });
            yield this.prisma.$transaction(updates);
        });
    }
    ;
    reorderContent(contents, dashboardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updates = contents.map((content, position) => {
                return this.prisma.content.update({
                    where: {
                        id: content.id,
                    },
                    data: {
                        position: position,
                        dashboardId: dashboardId,
                    },
                });
            });
            console.log(updates);
            yield this.prisma.$transaction(updates);
        });
    }
    ;
    moveContent(userId, contentId, position, fromDashboardId, toDashboardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fromToSameDashboard = fromDashboardId === toDashboardId;
            const fromDashboard = yield this.getDashboard(userId, fromDashboardId);
            if (!fromDashboard) {
                return false;
            }
            if (!fromToSameDashboard) {
                const toDashboard = yield this.getDashboard(userId, toDashboardId);
                if (!toDashboard) {
                    return false;
                }
            }
            const fromContents = yield this.prisma.content.findMany({
                orderBy: {
                    position: 'asc',
                },
                where: {
                    dashboardId: fromDashboardId,
                },
            });
            const toContents = fromToSameDashboard
                ? fromContents
                : yield this.prisma.content.findMany({
                    orderBy: {
                        position: 'asc',
                    },
                    where: {
                        dashboardId: toDashboardId,
                    },
                });
            if (position > toContents.length) {
                return false;
            }
            const oldPosition = fromContents.findIndex((c) => c.id === contentId);
            if (oldPosition === -1) {
                return false;
            }
            const [content] = fromContents.splice(oldPosition, 1);
            toContents.splice(position, 0, content);
            yield this.reorderContent(fromContents, fromDashboardId);
            if (!fromToSameDashboard) {
                yield this.reorderContent(toContents, toDashboardId);
            }
            return true;
        });
    }
    ;
    /////////////////////////////////////////////////////
    createContent(userId, dashboardId, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const dashboard = yield this.getDashboard(userId, dashboardId);
            if (!dashboard) {
                return null;
            }
            const countContent = yield this.prisma.content.count({
                where: {
                    dashboardId: dashboardId,
                },
            });
            return yield this.prisma.content.create({
                data: {
                    position: countContent,
                    text: text,
                    dashboardId: dashboardId,
                },
            });
        });
    }
    ;
    createDashboard(userId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const countDashboards = yield this.prisma.dashboard.count();
            return yield this.prisma.dashboard.create({
                data: {
                    position: countDashboards,
                    name: name,
                    userId: userId,
                },
            });
        });
    }
    deleteDashboard(userId, dashboardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dashboard = yield this.getDashboard(userId, dashboardId);
            if (!dashboard) {
                return null;
            }
            const contentsInDashboard = yield this.prisma.content.count({
                where: {
                    dashboardId: dashboardId,
                },
            });
            if (contentsInDashboard > 0) {
                return null;
            }
            const dashboards = yield this.prisma.dashboard.findMany();
            yield this.reorderDashboard(dashboards);
            return yield this.prisma.dashboard.delete({
                where: {
                    id: dashboardId,
                },
            });
        });
    }
    deleteContent(userId, dashboardId, contentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dashboard = yield this.getDashboard(userId, dashboardId);
            if (!dashboard) {
                return;
            }
            const deleted = yield this.prisma.content.delete({
                where: {
                    id_dashboardId: {
                        dashboardId: dashboardId,
                        id: contentId,
                    }
                },
            });
            const allContents = yield this.prisma.content.findMany({
                where: {
                    dashboardId: dashboardId,
                },
            });
            yield this.reorderContent(allContents, dashboardId);
            return deleted;
        });
    }
    getDashboard(userId, dashboardId) {
        return this.prisma.dashboard.findUnique({
            where: {
                id_userId: {
                    id: dashboardId,
                    userId: userId,
                },
            },
        });
    }
}
exports.DashboardService = DashboardService;
;
