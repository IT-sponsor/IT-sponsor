import prisma from "@/app/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { issueId: Number } }
) {
    let issues = await prisma.issues.findMany({
        where: { id: Number(params.issueId) }
    });
    return NextResponse.json(issues);
}