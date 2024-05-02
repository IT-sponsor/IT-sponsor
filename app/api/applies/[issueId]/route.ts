import prisma from "@/app/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { issueId: Number} }
) {
    const faultApplicants = await prisma.applies.findMany({
        where: { fk_issuesid: Number(params.issueId) }
    });
    if(!faultApplicants) return new NextResponse(JSON.stringify({ message: "Fault applicants not found" }), { status: 404 });
    return NextResponse.json(faultApplicants);
}