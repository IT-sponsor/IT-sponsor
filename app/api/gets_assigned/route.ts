import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const assigned = await prisma.gets_assigned.findMany();
    if(!assigned) return new NextResponse(JSON.stringify({ message: "Assigned not found" }), { status: 404 });
    return NextResponse.json(assigned);
}