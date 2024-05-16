import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: Number } }
) {
    let profile = await prisma.users.findUnique({
        where: { id: Number(params.id) },
        include: {
            images: true
        }
    });
    if (!profile) {
        return new NextResponse(
          JSON.stringify({ message: "Profile not found" }),
          { status: 404 }
        );
      }
    return NextResponse.json(profile);
}