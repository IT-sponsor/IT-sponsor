import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { issueId: Number} }
) {
    if (req.method === 'POST') {
        try {
            await prisma.$transaction(async (tx) =>{
                const updateIssue = await prisma.issues.update({
                    where: { id: Number(params.issueId) },
                    data: { status: "closed" }
                });
                const apply = await prisma.applies.deleteMany({
                    where: {
                        fk_issuesid: Number(params.issueId) }
                    },
                );
                const assign = await prisma.gets_assigned.deleteMany({
                    where: {
                        fk_issuesid: Number(params.issueId) }
                    },
                );
            });
            
            return new NextResponse(JSON.stringify({ message: "Issue updated successfully" }), { status: 201 });
        } catch (error: any) {
            return new NextResponse(JSON.stringify({ message: "Error updating issue", error: error.message }), { status: 500 });
        }
    } else {
        return new NextResponse(JSON.stringify({ message: `Method ${req.method} Not Allowed` }), { status: 405 });
    }
}