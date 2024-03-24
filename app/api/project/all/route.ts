import prisma from "@/app/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const projects = await prisma.projects.findMany({
    include: {
      images: true,
    },
  });
  return NextResponse.json(projects);
}
