import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { issueId: Number} }
) {
    const faultAssignees = await prisma.gets_assigned.findMany({
        where: { fk_issuesid: Number(params.issueId) }
    });
    return NextResponse.json(faultAssignees);
}

// Delete
export async function POST(req: NextRequest) {
    if (req.method === 'POST') {
        const data = await req.json();
        const {
            issue_id,
            user_id
        }: {
            issue_id: number,
            user_id: number
        } = data;
        try {
            const assign = await prisma.gets_assigned.delete({
                where: {
                    fk_usersid_fk_issuesid: { fk_issuesid: issue_id, fk_usersid: user_id } }
                },
            );
            return new NextResponse(JSON.stringify({ message: "Assign deleted successfully", assign }), { status: 201 });
        } catch (error: any) {
            return new NextResponse(JSON.stringify({ message: "Error deleting assign", error: error.message }), { status: 500 });
        }
    } else {
        return new NextResponse(JSON.stringify({ message: `Method ${req.method} Not Allowed` }), { status: 405 });
    }
}

