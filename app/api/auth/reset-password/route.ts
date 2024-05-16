import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/app/utils/prisma/client";
import { verifyResetHash } from '@/lib/crypto';
import { hash as hashPassword } from 'bcrypt';

export async function POST(req: NextRequest, res: NextResponse) {
    const data = await req.json();
    const { userId, timestamp, hash, newPassword } = data;

  if (!userId || !timestamp || !hash || !newPassword) {
    return new NextResponse(JSON.stringify({ message: "All fields are required" }), { status: 400 });
  }

  const isValid = verifyResetHash(userId, timestamp, hash);

  if (!isValid) {
    return new NextResponse(JSON.stringify({ message: "Invalid or expired reset link" }), { status: 400 });
  }

  const hashedPassword = await hashPassword(newPassword, 10);

  await prisma.users.update({
    where: { id: parseInt(userId) },
    data: { password: hashedPassword },
  });

  return new NextResponse(JSON.stringify({ message: "Slaptažodis pakeistas sėkmingai" }), { status: 200 });
};