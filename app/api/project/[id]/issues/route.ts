import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: Number } }
) {
    let issues = await prisma.issues.findMany({
        where: { fk_projectsid: Number(params.id) }
    });
    return NextResponse.json(issues);
}
