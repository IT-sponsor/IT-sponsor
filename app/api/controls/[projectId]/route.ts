import prisma from "@/app/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { projectId: Number } }
) {
    let projectAdmins = await prisma.controls.findMany({
        where: { fk_projectsid: Number(params.projectId) }
    });
    return NextResponse.json(projectAdmins);
}

export async function POST(
    request: Request,
    { params }: { params: { projectId: Number } }
) {
    try {
        const body = await request.json(); 

        const { userId } = body;

        const createdControl = await prisma.controls.create({
            data: {
                fk_projectsid: Number(params.projectId),
                fk_usersid: userId
            }
        });
        return new NextResponse(JSON.stringify(createdControl), { status: 201 });
    } catch (error) {
        console.error("Error while creating project control:", error);
        return new NextResponse(JSON.stringify({ message: "Failed to create control." }), { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { projectId: Number } }
) {
    try {
        const body = await request.json();

        const { userId } = body;

        const deletedControl = await prisma.controls.delete({
            where: {
                fk_usersid_fk_projectsid: {
                    fk_projectsid: Number(params.projectId),
                    fk_usersid: userId
                }
            }
        });
        return new NextResponse(JSON.stringify(deletedControl), { status: 200 });
    } catch (error) {
        console.error("Error while deleting project control:", error);
        return new NextResponse(JSON.stringify({ message: "Failed to delete control." }), { status: 500 });
    }
}