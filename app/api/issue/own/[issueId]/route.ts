import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { issueId: Number } }
) {
    let issue = await prisma.issues.findUnique({
        where: { id: Number(params.issueId)}
    });
    if(!issue) return new NextResponse(JSON.stringify({ message: "Issue not found" }), { status: 404 });
    return NextResponse.json(issue);
}