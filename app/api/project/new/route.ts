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
            const lastProject = await prisma.project.findFirst({
                orderBy: {
                    id_project: 'desc',
                },
            }); 

            const newId = lastProject ? lastProject.id_project + 1 : 1; // if there are no projects 

            const project = await prisma.project.create({
                data: {
                    id_project: newId,
                    name,
                    short_description,
                    long_description,
                    repository,
                    technology,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            }); // Create new project in the database

            console.log('Project created', project); 

        } catch (error) {
            console.error('Error creating project:', error); 
        }
    } else {
        console.log(`Method ${req.method} Not Allowed`); // method not allowed (not post)
    }
}
