import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { projectId: Number } }
) {
    let faults = await prisma.faults.findMany({
        where: { fk_projectsid: Number(params.projectId) }
    });
    return NextResponse.json(faults);
}

export async function DELETE(
    request: Request
) {
    try {
        const data = await request.json();
        const { faultId }: { faultId: number } = data;
        await prisma.faults.delete({
            where: {
                id: Number(faultId)
            }
        });
        console.log('Fault deleted successfully');
        return new NextResponse(JSON.stringify({ message: "Fault deleted successfully" }), { status: 200 });
    } catch (error: any) {
        console.error('Error deleting fault', error);
        return new NextResponse(JSON.stringify({ message: "Error deleting fault", error: error.message }), { status: 500 });
    }
}