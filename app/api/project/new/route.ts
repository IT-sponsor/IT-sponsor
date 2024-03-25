import prisma from "@/app/utils/prisma/client";
import { projects_codebase_visibility } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    console.log('Request received', req); // Log the incoming request

    if (req.method === 'POST') {
        let data;
        try {
            data = await req.json();
            console.log('Request data', data); // Log the data received in the request
        } catch (error) {
            console.error('Error parsing request data', error);
            return new NextResponse(JSON.stringify({ message: "Error parsing request data", error: error.message }), { status: 400 });
        }

        const { name, short_description, long_description, repository, technology, codebase_visibility, fk_imagesid_images } = data;
        console.log('Extracted data', { name, short_description, long_description, repository, technology, codebase_visibility, fk_imagesid_images }); // Log the extracted data

        try {

            const lastProject = await prisma.projects.findFirst({
                orderBy: {
                    id: 'desc',
                },
            }); 

            const newId = lastProject ? lastProject.id + 1 : 1; // if there are no projects 

            console.log('Creating project with data', data); // Log right before creating the project
            const project = await prisma.projects.create({
                data: {
                    id: newId, // Add the 'id' property
                    name,
                    short_description,
                    long_description,
                    repository,
                    technologies: technology, // Assuming this should be technology based on your data extraction
                    created_at: new Date(),
                    updated_at: new Date(),
                    star_count: 0,
                    contributor_count: 0,
                    codebase_visibility: codebase_visibility as projects_codebase_visibility,
                    fk_imagesid_images
                },
            });
            console.log('Project created', project); // Log the created project
            return new NextResponse(JSON.stringify({ message: "Project created successfully", project }), { status: 201 });
        } catch (error) {
            console.error('Error creating project', error); // Log any errors during project creation
            return new NextResponse(JSON.stringify({ message: "Error creating project", error: error.message }), { status: 500 });
        }
    } else {
        console.log(`Method ${req.method} Not Allowed`); // Log if a non-POST method is used
        return new NextResponse(JSON.stringify({ message: `Method ${req.method} Not Allowed` }), { status: 405 });
    }
}
