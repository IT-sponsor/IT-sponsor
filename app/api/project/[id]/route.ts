import prisma from "@/app/utils/prisma/client";
import { NextApiResponse } from "next/server";
import { NextResponse } from "next/server";

export async function GET(
    request: NextApiResponse,
    { params }: { params: { id: Number } }
) {
    let project = await prisma.project.findUnique({
        where: { id_project: Number(params.id) },
        include: {
            image: true, // include related image data
        },
    });
    return NextResponse.json(project);
}


