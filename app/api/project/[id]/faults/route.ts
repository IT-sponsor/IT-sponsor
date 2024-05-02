import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: Number } }
) {
    let faults = await prisma.faults.findMany({
        where: { 
            fk_projectsid: Number(params.id) 
        },
        include: {
            users: {
                include: {
                    images: true
                }
            }
        }
    });
    return NextResponse.json(faults);
}
