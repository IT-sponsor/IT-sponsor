import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const applies = await prisma.applies.findMany();
    return NextResponse.json(applies);
}