import prisma from "@/app/utils/prisma/client";
import { faults_severity, faults_status } from "@prisma/client";
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

export async function POST(
    req: NextRequest,
    { params }: { 
        params: { 
            id: Number,
            faultId: Number 
        } 
    }
) {
    if (req.method === 'POST') {
        const data = await req.json();
        const {
            title,
            description,
            severity,
            status,
        }: {
            title: string,
            description: string,
            severity: string,
            status: string,
        } = data;

        try {
            const fault = await prisma.faults.update({
                where: {
                    id: Number(params.faultId),
                    fk_projectsid: Number(params.id)
                },
                data: {
                    title: title,
                    description: description,
                    severity: severity as faults_severity,
                    status: status as faults_status,
                },
            });

            const updateProject = await prisma.projects.update({
                where: { id: Number(params.id) },
                data: {
                  updated_at: new Date(),
                },
            });

            return new NextResponse(JSON.stringify({ message: "Fault updated successfully", fault }), { status: 201 });
        } catch (error: any) {
            return new NextResponse(JSON.stringify({ message: "Error updating fault", error: error.message }), { status: 500 });
        }
    } else {
        return new NextResponse(JSON.stringify({ message: `Method ${req.method} Not Allowed` }), { status: 405 });
    }
}