import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: Number } }
) {
    console.log("Received image:", params);

    let image = await prisma.images.findUnique({
        where: { id_images: Number(params.id) },
    });
    return NextResponse.json(image);
}
