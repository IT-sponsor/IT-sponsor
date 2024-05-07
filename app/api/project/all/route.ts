import prisma from '@/app/utils/prisma/client'
import { NextResponse } from 'next/server'
import { get_volunteer_count } from '@/app/api/project/[id]/route'

export async function GET() {
  let volunteers = await get_volunteer_count()
  const projects = await prisma.projects.findMany({
    include: {
      images: true,
    },
  })
  projects.forEach((project) => {
    const projectId = project.id
    const volunteerCount = volunteers[projectId] ?? 0

    project.contributor_count = volunteerCount
  })
  return NextResponse.json(projects)
}
