import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    console.log("POST /api/image/upload");
    const formData = await req.formData();

    const uploadedAt = formData.get("uploadedAt") as string || null;
    const file = formData.get("image") as File || null;
    const fk_faultsId = Number(formData.get("fk_faultsId")) || null;
    const fk_issuesId = Number(formData.get("fk_issuesId")) || null;

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileBlob = new Blob([buffer], { type: file.type });

    try {
        const imageReq = await prisma.images.create({
            data: {
                uploaded_at: uploadedAt ? new Date(uploadedAt) : new Date(),
                image: buffer,
            }
        });
        return NextResponse.json({ upload: imageReq });
    } catch (e: any) {
        console.error("Error while trying to write file\n", e);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}