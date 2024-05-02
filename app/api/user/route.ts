import { NextRequest, NextResponse } from "next/server";
import { hash } from 'bcrypt';
import z from 'zod';
import prisma from "@/app/utils/prisma/client";
import { GET as getApplies } from "@/app/api/applies/route";
import { GET as getAssigned } from "@/app/api/gets_assigned/route";

const userSchema = z
  .object({
    first_name: z.string().min(1, 'Vardas reikalingas'),
    last_name: z.string().min(1, 'Pavarde reikalinga'),
    email: z.string().min(1, 'El. pastas reikalingas').email('Netinkamas el. pasto adresas'),
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
            return NextResponse.json({ users: null, message: "el. pasto adresas egzistuoja"}, {status : 409})
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

interface Applied {
    fk_usersid: number;
    fk_issuesid: number;
};

interface Assigned {
    fk_usersid: number;
    fk_issuesid: number;
};

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    fk_imagesid_images: number;
    gets_assigned: number[];
    applies: number[];
}

export async function GET(
    request: NextRequest,
) {
    try {
        const applied = await getApplies()
        .then((response) => response.json())
        .then((data) => data)
        .catch((error) => {
            throw new Error(error.message);
        });

        const assigned = await getAssigned()
        .then((response) => response.json())
        .then((data) => data)
        .catch((error) => {
            throw new Error(error.message);
        });

        const assignedUserIds = assigned.map((assign: Assigned) => assign.fk_usersid);
        const appliedUserIds = applied.map((apply: Applied) => apply.fk_usersid);

        const combinedUserIds = [...assignedUserIds, ...appliedUserIds];

        const uniqueUserIds = Array.from(new Set(combinedUserIds));

        const assignedUsers: User[] = await prisma.users.findMany({
            where: {
                id: {
                    in: uniqueUserIds
                }
            },
        });

        if (!assignedUsers) {
            throw new Error('No assigned users found');
        }

        assignedUsers.forEach((user) => {
            user.gets_assigned = assigned.filter((assign: Assigned) => assign.fk_usersid === user.id).map((assign: Assigned) => assign.fk_issuesid);
            user.applies = applied.filter((apply: Applied) => apply.fk_usersid === user.id).map((apply: Applied) => apply.fk_issuesid);
        });

        return NextResponse.json({ users: assignedUsers, message: "Assigned users fetched" }, { status: 200 });
    } catch (error) {
      console.error("Error in GET /api/user:", error.message);
      return NextResponse.json({ message: error.message || "Something went wrong" }, { status: 500 });
    }
}