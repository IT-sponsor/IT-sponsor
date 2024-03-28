import { NextRequest, NextResponse } from "next/server";
import { hash } from 'bcrypt';
import z from 'zod';
import prisma from "@/app/utils/prisma/client";

const userSchema = z
  .object({
    first_name: z.string().min(1, 'Vardas reikalingas'),
    last_name: z.string().min(1, 'Pavarde reikalinga'),
    email: z.string().min(1, 'E.Pastas reikalingas').email('Netinkamas e.pasto adresas'),
    password: z.string().min(1, 'Slaptazodis reikalingas').min(8, 'Slaptazodis privalo buti ilgesnis nei 8 simboliai')
    })

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { first_name, last_name, email, password } = userSchema.parse(body);

        const existingUserByEmail = await prisma.users.findUnique({
            where: { email: email }
        });

        if(existingUserByEmail) {
            return NextResponse.json({ users: null, message: "Email already exists"}, {status : 409})
        }

        const hashPassword = await hash(password, 10);
        const newUser = await prisma.users.create({
            data: {
                first_name,
                last_name,
                email,
                password: hashPassword,
                fk_imagesid_images: null
                }
            }
        );
        const { password: newUserPassword, ...rest } = newUser;

        return NextResponse.json({ users: rest, message: "User created" }, { status: 201 });
    } catch(error) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}