import prisma from "@/app/utils/prisma/client";
import { projects_codebase_visibility } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    if (req.method === 'POST') {
        let data;
        try {
            data = await req.json();
        } catch (error) {
            return new NextResponse(JSON.stringify({ message: "Error parsing request data", error: error.message }), { status: 400 });
        }

        const { repository } = data;

        // Check if repository already exists
        const existingProject = await prisma.projects.findUnique({
            where: { repository },
        });

        if (existingProject) {
            return new NextResponse(JSON.stringify({ message: "Repository already exists" }), { status: 400 });
        }

        // Continue with project creation if repository is unique
        try {
            const project = await prisma.projects.create({
                data: {
                    // your project data
                    name: data.name,
                    short_description: data.short_description,
                    long_description: data.long_description,
                    repository,
                    technologies: data.technology,
                    created_at: new Date(),
                    updated_at: new Date(),
                    star_count: 0,
                    contributor_count: 0,
                    codebase_visibility: data.codebase_visibility as projects_codebase_visibility,
                    fk_imagesid_images: data.fk_imagesid_images,
                },
            });
            return new NextResponse(JSON.stringify({ message: "Project created successfully", project }), { status: 201 });
        } catch (error) {
            return new NextResponse(JSON.stringify({ message: "Error creating project", error: error.message }), { status: 500 });
        }
    } else {
        return new NextResponse(JSON.stringify({ message: `Method ${req.method} Not Allowed` }), { status: 405 });
    }
}
