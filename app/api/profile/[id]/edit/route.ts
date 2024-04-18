import { NextRequest, NextResponse } from "next/server";
import { hash } from 'bcrypt';
import prisma from "@/app/utils/prisma/client";


export async function PUT(req: NextRequest) {
    if (req.method !== 'PUT') {
        return new NextResponse(JSON.stringify({ message: `Method ${req.method} Not Allowed` }), { status: 405 });
    }

    try {
        const data = await req.json();
        const { id, email, github, ...userData } = data;

        const existingUserByEmail = await prisma.users.findUnique({
            where: { email: email },
        });
        if (existingUserByEmail && existingUserByEmail.id !== id) {
            return new NextResponse(JSON.stringify({ message: "Email already exists" }), { status: 409 });
        }

        let existingUserByGithub = null;
        if (github !== null) {
            existingUserByGithub = await prisma.users.findUnique({
                where: { github: github },
            });
            if (existingUserByGithub && existingUserByGithub.id !== id) {
                return new NextResponse(JSON.stringify({ message: 'GitHub username already exists' }), { status: 409 });
            }
        }
        
        const updatedUserData = {
            ...userData,
            email: existingUserByEmail ? existingUserByEmail.email : email, // Keep the existing email if it exists
            github: existingUserByGithub ? existingUserByGithub.github : github, // Keep the existing GitHub username if it exists
            password: userData.password ? await hash(userData.password, 10) : undefined,
        };
        
        const updatedUser = await prisma.users.update({
            where: { id: id },
            data: updatedUserData,
        });

        //console.log('User updated', updatedUser);
        return new NextResponse(JSON.stringify({ message: 'User updated successfully', user: updatedUser }), { status: 200 });
    } catch (error) {
        console.error('Error updating user', error);
        const errorMessage = (error as Error).message;
        return new NextResponse(JSON.stringify({ message: 'Error updating user', error: errorMessage }), { status: 500 });
    }
}