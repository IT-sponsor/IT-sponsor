import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { projectId: number } }
) {
    let faults = await prisma.faults.findMany({
        where: { fk_projectsid: { equals: params.projectId } }
    });
    return NextResponse.json(faults);
}
