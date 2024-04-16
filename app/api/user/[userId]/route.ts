import prisma from "@/app/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { userId: Number } }
) {
    try {
        const userDetails = await prisma.users.findUnique({
            where: { id: Number(params.userId) },
        });

        if (userDetails) {
            return NextResponse.json(userDetails);
        } else {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}