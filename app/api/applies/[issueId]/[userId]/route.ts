import prisma from "@/app/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { issueId: Number, userId: number } }
) {
    console.log(params);
    let faultApplicants = await prisma.applies.findMany({
        where: { fk_issuesid: Number(params.issueId), fk_usersid: Number(params.userId)}
    });
    return NextResponse.json(faultApplicants);
}
