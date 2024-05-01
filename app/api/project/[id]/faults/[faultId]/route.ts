import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { 
        params: { 
            id: Number,
            faultId: Number 
        } 
    }
) {
    let fault = await prisma.faults.findUnique({
        where: { 
            id: Number(params.faultId),
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

    if (!fault) {
        return new NextResponse(
            JSON.stringify({ message: "Fault not found" }),
            { status: 404 }
        );
    }

    return NextResponse.json(fault);
}