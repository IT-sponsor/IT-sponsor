import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    console.log('Request received', req); // incoming request
    if (req.method === 'POST') {
        const data = await req.json();
        console.log('Request data', data); 
        const { name, short_description, long_description, repository, technology } = data;

        // retrieves highest current id and ++
        try {
            const lastProject = await prisma.projects.findFirst({
                orderBy: {
                    id: 'desc',
                },
            }); 

            const newId = lastProject ? lastProject.id + 1 : 1; // if there are no projects 

            const project = await prisma.projects.create({
                data: {
                    id: newId,
                    name,
                    short_description,
                    long_description,
                    repository,
                    technologies,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            }); // Create new project in the database

            console.log('Project created', project); 
            return new NextResponse(JSON.stringify({ message: "Project created successfully", project }), { status: 201 }); 

        } catch (error) {
            return new NextResponse(JSON.stringify({ message: "Error creating project", error: error.message }), { status: 500 }); 
        }
    } else {
        return new NextResponse(JSON.stringify({ message: `Method ${req.method} Not Allowed` }), { status: 405 });
    }
}
