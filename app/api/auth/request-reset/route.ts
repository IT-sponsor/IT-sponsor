import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/app/utils/prisma/client";
import { sendResetPasswordEmail } from '@/lib/mail';
import { generateResetHash } from '@/lib/crypto';

export async function POST(req: NextRequest, res: NextResponse) {
      const data = await req.json();
      const { email } = data;

      try {
        const user = await prisma.users.findUnique({ where: { email } });
  
        if (!user) {
          return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
        }
        const { hash, timestamp } = generateResetHash(user.id.toString());
        await sendResetPasswordEmail(email, user.id.toString(), hash, timestamp.toString());
        
        return new NextResponse(JSON.stringify({ message: "Password reset email sent successfully" }), { status: 200 });
      } catch (error) {
        console.error('Error requesting password reset:', error);
        return new NextResponse(JSON.stringify({ message: "Internal server error" }), { status: 500 });
      }
  }