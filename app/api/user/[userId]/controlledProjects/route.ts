import prisma from "@/app/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { userId: number } }
) {
    try {
        const controls = await prisma.controls.findMany({
            where: {
                fk_usersid: Number(params.userId),
            },
            select: {
                fk_projectsid: true,
            },
        });

        const projectIds = controls.map(control => control.fk_projectsid);

        const projects = await prisma.projects.findMany({
            where: {
                id: { in: projectIds },
            },
            include: {
                images: true,
            },
        });

        return NextResponse.json({ projects });
    } catch (error) {
        console.error("Error fetching controlled projects:", error);
        return NextResponse.json({ error: "Error fetching controlled projects" }, { status: 500 });
    }
}
