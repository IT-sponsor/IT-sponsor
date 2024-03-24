import prisma from "@/app/utils/prisma/client";
import { NextApiResponse } from "next/server";
import { NextResponse } from "next/server";

export async function GET(
    request: NextApiResponse,
    { params }: { params: { id: Number } }
) {
    console.log("Received image:", params);

    let image = await prisma.images.findUnique({
        where: { id_images: Number(params.id) },
        select: { image: true } // getting only the image
    });
    return NextResponse.json(image);
}
