import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const assigned = await prisma.gets_assigned.findMany();
    return NextResponse.json(assigned);
}