import prisma from "@/app/utils/prisma/client";
import { NextRequest,NextResponse } from "next/server";

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


