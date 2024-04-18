import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    if (req.method === 'DELETE') {
        const data = await req.json();
        console.log('Request data', data);
        const { faultId }: { faultId: number } = data;

        try {
            await prisma.faults.delete({
                where: {
                    id: faultId
                }
            });
            console.log('Fault deleted successfully');
            return new NextResponse(JSON.stringify({ message: "Fault deleted successfully" }), { status: 200 });
        } catch (error) {
            console.error('Error deleting fault', error);
            return new NextResponse(JSON.stringify({ message: "Error deleting fault", error: error.message }), { status: 500 });
        }
    } else {
        console.error
        return new NextResponse(JSON.stringify({ message: `Method ${req.method} Not Allowed` }), { status: 405 });
    }
}
