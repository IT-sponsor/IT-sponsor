import prisma from "@/app/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { userId: Number } }
) {
    let controls = await prisma.controls.findMany({
        where: {
            fk_usersid: Number(params.userId)
        },
        include: {
            projects: true,
        }
    })

    let projects = controls.map(controls => controls.projects);

    return NextResponse.json(projects);
}