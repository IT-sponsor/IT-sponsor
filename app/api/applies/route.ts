import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const applies = await prisma.applies.findMany();
    if(!applies) return new NextResponse(JSON.stringify({ message: "Applies not found" }), { status: 404 });
    return NextResponse.json(applies);
}