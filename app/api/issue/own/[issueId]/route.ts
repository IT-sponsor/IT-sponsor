import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { issueId: Number } }
) {
    let issue = await prisma.issues.findUnique({
        where: { id: Number(params.issueId)}
    });
    console.log(issue);
    return NextResponse.json(issue);
}