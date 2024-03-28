import prisma from "@/app/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { projectId: Number } }
) {
    let issues = await prisma.issues.findMany({
        where: { fk_projectsid: Number(params.projectId) }
    });
    return NextResponse.json(issues);
}