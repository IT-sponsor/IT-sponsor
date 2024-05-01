import prisma from "@/app/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { projectId: Number } }
) {
    let faults = await prisma.controls.findMany({
        where: { fk_projectsid: Number(params.projectId) }
    });
    return NextResponse.json(faults);
}

export async function POST(request: Request) {
    try {
        const body = await request.json(); 

        const { projectId, userId } = body;

        const createdControl = await prisma.controls.create({
            data: {
                fk_projectsid: projectId,
                fk_usersid: userId
            }
        });
        return new NextResponse(JSON.stringify(createdControl), { status: 201 });
    } catch (error) {
        console.error("Error while creating control:", error);
        return new NextResponse(JSON.stringify({ message: "Failed to create control." }), { status: 500 });
    }
}