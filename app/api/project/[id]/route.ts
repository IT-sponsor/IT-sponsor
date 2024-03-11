import prisma from "@/app/utils/prisma/client";
import { NextResponse } from "next/server";

// Temporary sollution (hard coded)
// export async function GET(){
//     try {
//         const project = await prisma.project.findUnique({
//             where: { id_project: 1 },
//         });

//         if (!project) {
//             return NextResponse.json('project not found')
//         }
//         //console.log("Received params:", project);
//         return NextResponse.json(project);
//     } catch (error) {
//         console.error('Request error', error);
//         return NextResponse.json('Error fetching project')
//     }
// }

// at the moment params does not return anything

import { NextApiResponse } from "next/server";
export async function GET({ params }: { params: { id: string } }, res: NextApiResponse) {
    console.log("Received params:", params);
    const projectId = parseInt(params?.id, 10);
    

    try {
        const project = await prisma.project.findUnique({
            where: { id_project: 1 },
        });

        if (!project) {
            return res.json('project not found')
        }

        return res.json(project);
    } catch (error) {
        console.error('Request error', error);
        return res.json('Error fetching project')
    }
}


