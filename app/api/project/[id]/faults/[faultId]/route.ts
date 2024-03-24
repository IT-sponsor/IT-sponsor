import prisma from "@/app/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { 
        params: { 
            id: Number,
            faultId: Number 
        } 
    }
) {
    console.log('id', params.id);
    console.log('faultId', params.faultId);

    let fault = await prisma.faults.findUnique({
        where: { 
            id: Number(params.faultId),
            fk_projectsid: Number(params.id)
        }
    });
    return NextResponse.json(fault);
}