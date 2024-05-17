import prisma from "@/app/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { userId: number } }
) {
    try {
        const createdFaults = await prisma.faults.findMany({
            where: {
                fk_usersid: Number(params.userId)
            },
            include: {
                users: {
                    include: {
                        images: true
                    }
                }
            }
        });
        return NextResponse.json(createdFaults);
    } catch (error) {
        console.error("Error fetching faults:", error);
        return NextResponse.json({ error: "Error fetching faults" }, { status: 500 });
    }
}
