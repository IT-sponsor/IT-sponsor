import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

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
            const gets_assigned = await prisma.gets_assigned.create({
                data: {
                    fk_issuesid: issue_id as number,
                    fk_usersid: user_id as number,
                },
            });
            console.log('Gets_assigned created', gets_assigned);
            return new NextResponse(JSON.stringify({ message: "Gets_assigned created successfully", gets_assigned }), { status: 201 });
        } catch (error) {
            console.error('Error creating applies', error);
            return new NextResponse(JSON.stringify({ message: "Error creating gets_assigned", error: error.message }), { status: 500 });
        }
    } else {
        console.error
        return new NextResponse(JSON.stringify({ message: `Method ${req.method} Not Allowed` }), { status: 405 });
    }
}