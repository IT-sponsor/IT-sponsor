import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    if (req.method === 'POST') {
        const data = await req.json();
        console.log('Request data', data);
        const {
            id_user,
            id_issue
        }: {
            id_user: number,
            id_issue: number
        } = data;

        try {
            const applies = await prisma.applies.create({
                data: {
                    fk_usersid: id_user as number,
                    fk_issuesid: id_issue as number
                },
            });
            console.log('Applies created', applies);
            return new NextResponse(JSON.stringify({ message: "Applies created successfully", applies }), { status: 201 });
        } catch (error) {
            console.error('Error creating applies', error);
            return new NextResponse(JSON.stringify({ message: "Error creating applies", error: error.message }), { status: 500 });
        }
    } else {
        console.error
        return new NextResponse(JSON.stringify({ message: `Method ${req.method} Not Allowed` }), { status: 405 });
    }
}