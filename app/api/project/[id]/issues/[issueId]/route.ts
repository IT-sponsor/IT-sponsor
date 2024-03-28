import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { 
        params: { 
            id: Number,
            issueId: Number 
        } 
    }
) {
    let issue = await prisma.issues.findUnique({
        where: { 
            id: Number(params.issueId),
            fk_projectsid: Number(params.id)
        }
    });
    return NextResponse.json(issue);
}