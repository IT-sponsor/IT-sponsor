import prisma from "@/app/utils/prisma/client";
import { NextApiResponse } from "next/server";
import { NextResponse } from "next/server";

export async function GET(
    request: NextApiResponse,
    { params }: { params: { id: Number } }
) {
    console.log("Received params:", params);

    let image = await prisma.image.findUnique({
        where: { id_image: Number(params.id) },
        select: { image_blob: true } // getting only the image
    });
    return NextResponse.json(image);
}
