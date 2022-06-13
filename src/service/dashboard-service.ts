import { Content, Dashboard, PrismaClient, Comment } from "@prisma/client";

export class DashboardService {
    constructor(private readonly prisma: PrismaClient){}

    async moveDashboard(userId: string, dashboardId: string, position: number): Promise<boolean>{
        const dashboards = await this.prisma.dashboard.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                position: 'asc',
            },
        });

        if (position >= dashboards.length){
            return false;
        } 
            //@ts-ignore
        const oldPosition = dashboards.findIndex((d) => d.id === dashboardId);
        if(oldPosition === -1) {
            return false;
        }
        const [dashboard] = dashboards.splice(oldPosition, 1);
        dashboards.splice(position, 0, dashboard);
        await this.reorderDashboard(dashboards);
        return true;
    }
    

    getDashboards(userId: string) {
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
                        position:'asc',
                    },
                    include: {
                        comments: {
                            orderBy: {
                            position:'asc',
                            },
                    }
                },
                },
            },
        });
    }

    getComments(commentId: string) {
        return this.prisma.comment.findUnique({
            where: {
                id: commentId,
            },
        });
    }

    private async reorderDashboard(dashboards: Dashboard[]) {
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
        await this.prisma.$transaction(updates)
    };

  private async reorderContent(contents: Content[], dashboardId: string) {
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
        console.log(updates)
        await this.prisma.$transaction(updates)
    };

    async moveContent(
        userId: string,
        contentId: string,
        position: number,
        fromDashboardId: string,
        toDashboardId: string
        ): Promise<boolean> {
        const fromToSameDashboard = fromDashboardId === toDashboardId;

        const fromDashboard = await this.getDashboard(userId,fromDashboardId);
        if (!fromDashboard) {
            return false;
        }
        if(!fromToSameDashboard) {
            const toDashboard = await this.getDashboard(userId,toDashboardId);
            if (!toDashboard) {
                return false;
            }
        }

        const fromContents = await this.prisma.content.findMany({
            orderBy: {
                position: 'asc',
            },
            where: {
                dashboardId: fromDashboardId,
            },
        });

        const toContents = fromToSameDashboard
         ? fromContents 
         : await this.prisma.content.findMany({
            orderBy: {
                position: 'asc',
            },
            where: {
                dashboardId: toDashboardId,
            },
        });


        if(position > toContents.length){
            return false;
        }

        const oldPosition = fromContents.findIndex((c) => c.id === contentId);
        if(oldPosition === -1) {
            return false;
        }
        const [content] = fromContents.splice(oldPosition, 1);

        toContents.splice(position, 0, content);
        await this.reorderContent(fromContents, fromDashboardId);

        if(!fromToSameDashboard){
        await this.reorderContent(toContents, toDashboardId);
        }
        return true;
    };

    /////////////////////////////////////////////////////

    async createContent(userId: string, dashboardId: string, text: string, title: string, img: String){
        const dashboard = await this.getDashboard(userId,dashboardId);
        if (!dashboard) {
            return null;
        }
        const countContent = await this.prisma.content.count({
            where: {
                dashboardId: dashboardId,
            },
        });
        return await this.prisma.content.create({
            data:{
                position: countContent,
                text: text,
                title: title,
                dashboardId: dashboardId,
                like: 0,
                img: img,
            },
        });
    };

    async createComment(userId: string, contentsId: string, text: string, dashboardId: string){
        const dashboard = await this.getContent(dashboardId, contentsId);
        if (!dashboard) {
            return null;
        }
        const countComment = await this.prisma.comment.count({
            where: {
                contentsId: contentsId,
            },
        });
        return await this.prisma.comment.create({
            data:{
                position: countComment,
                text: text,
                contentsId: contentsId,
                dashboardId: dashboardId,
                userId: userId,
                like : 0,
            },
        });
    };

    async putLikeOnComment(commentId:string){
        return await this.prisma.comment.update({
            where: {
                id: commentId,
            },
            data:{
                like: {increment: 1},
            },
        });
    }
    async putLikeOnContent(contentId:string){
        return await this.prisma.content.update({
            where: {
                id: contentId,
            },
            data:{
                like: {increment: 1},
            },
        });
    }
    async leaveLikeOnContent(contentId:string){
        return await this.prisma.content.update({
            where: {
                id: contentId,
            },
            data:{
                like: {decrement: 1},
            },
        })
    }

    async createDashboard(userId: string, name: string){
        const countDashboards = await this.prisma.dashboard.count();
        return await this.prisma.dashboard.create({
            data:{
                position: countDashboards,
                name: name,
                userId: userId,
            },
        });
    }

    async deleteDashboard(userId: string, dashboardId: string){
        const dashboard = await this.getDashboard(userId,dashboardId);
        if (!dashboard) {
            return null;
        }
        const contentsInDashboard = await this.prisma.content.count({
            where:{
                dashboardId: dashboardId,
            },
        });
        if (contentsInDashboard >= 0 ){
            return null;
        }
        const dashboards = await this.prisma.dashboard.findMany();
        await this.reorderDashboard(dashboards);
        return await this.prisma.dashboard.delete({
            where:{
                id: dashboardId,
            },
        });
    }

    async deleteContent(userId: string, dashboardId: string, contentId: string){
        const dashboard = await this.getDashboard(userId,dashboardId);
        if (!dashboard) {
            return;
        }
        const deleted =  await this.prisma.content.delete({
            where:{
                id_dashboardId:{
                    dashboardId: dashboardId,
                    id: contentId,
                }
            },
        });

        const allContents = await this.prisma.content.findMany({
            where: {
                dashboardId: dashboardId,
            },
        });
        await this.reorderContent(allContents, dashboardId);

        return deleted;
    }

    getDashboard(userId: string, dashboardId: string){
        return this.prisma.dashboard.findUnique({
            where: {
                id_userId: {
                    id: dashboardId,
                    userId: userId,
                },
            },
        });
    }

    getContent(dashboardId: string, contentId: string){
        return this.prisma.content.findUnique({
            where: {
                id_dashboardId: {
                    id: contentId,
                    dashboardId: dashboardId,
                },
            },
        });
    }

    getComment(commentId: string){
        return this.prisma.comment.findUnique({
            where: {
                id: commentId,
            }
        })
    }

};


