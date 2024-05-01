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

export async function PATCH(
    request: NextRequest,
    { params }: { 
        params: { 
            id: Number,
            issueId: Number 
        } 
    }
) {
    const data = await request.json();
    console.log(data);
    try {
        const updatedIssue = await prisma.issues.update({
            where: { 
                id: Number(params.issueId),
                fk_projectsid: Number(params.id)
            },
            data: {
                title: data.title,
                description: data.description,
                visibility: data.visibility,
                status: data.status
            }
        })
        return NextResponse.json(updatedIssue);
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Error updating issue", error: error }), { status: 500 });
    }
}