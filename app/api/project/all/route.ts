import prisma from "@/app/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const projects = await prisma.project.findMany({
    include: {
      image: true, // Include related image data
    },
  });
  return NextResponse.json(projects);
}
