import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/prisma/client";

export async function GET(req: NextRequest) {
    try {
        const users = await prisma.users.findMany({
        });

        return NextResponse.json({ users });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}