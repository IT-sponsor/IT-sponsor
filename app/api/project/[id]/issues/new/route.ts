import prisma from "@/app/utils/prisma/client";
import { issues_visibility, issues_status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    if (req.method === 'POST') {
        const data = await req.json();
        console.log('Request data', data);
        const {
            title,
            description,
            status,
            visibility,
            id_project,
        }: {
            title: string,
            description: string,
            status: string,
            visibility: string,
            id_project: number,
        } = data;

        try {
            const issue = await prisma.issues.create({
                data: {
                    title,
                    description,
                    status: status as issues_status,
                    visibility: visibility as issues_visibility,
                    fk_projectsid: id_project as number,
                },
            });
            console.log('Issue created', issue);
            return new NextResponse(JSON.stringify({ message: "Issue created successfully", issue }), { status: 201 });
        } catch (error) {
            console.error('Error creating issue', error);
            return new NextResponse(JSON.stringify({ message: "Error creating issue", error: error.message }), { status: 500 });
        }
    } else {
        console.error
        return new NextResponse(JSON.stringify({ message: `Method ${req.method} Not Allowed` }), { status: 405 });
    }
}