import prisma from "@/app/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { issueId: Number} }
) {
    const faultAssignees = await prisma.gets_assigned.findMany({
        where: { fk_issuesid: Number(params.issueId) }
    });
    return NextResponse.json(faultAssignees);
}