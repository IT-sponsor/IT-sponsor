import prisma from "@/app/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { userId: Number } }
) {
    let assignments = await prisma.gets_assigned.findMany({
        where: {
            fk_usersid: Number(params.userId)
        },
        include: {
            issues: true,
        }
    })

    let issues = assignments.map(assignment => assignment.issues);

    return NextResponse.json(issues);
}