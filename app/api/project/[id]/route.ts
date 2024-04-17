import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: Number } }
) {
    let project = await prisma.projects.findUnique({
        where: { id: Number(params.id) },
        include: {
            images: true, // include related image data
        },
    });
    return NextResponse.json(project);
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: Number } }
) {
    const data = await request.json(); 
    try {
        const updatedProject = await prisma.projects.update({
            where: { id: Number(params.id) },
            data: {
                name: data.name,
                short_description: data.short_description,
                long_description: data.long_description,
                repository: data.repository,
                technologies: data.technologies,
            },
            include: {
                images: true, 
            },
        });
        return NextResponse.json(updatedProject);
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Error updating project", error: error.message }), { status: 500 });
    }
}
