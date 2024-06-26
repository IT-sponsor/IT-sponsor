import prisma from '@/app/utils/prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function get_volunteer_count() {
  let faults = await prisma.faults.findMany({})
  const fault_ids = faults.map((fault) => [
    fault.fk_usersid,
    fault.fk_projectsid,
  ])
  const projectFaultsMap: { [projectId: number]: number[] } = fault_ids.reduce(
    (acc, [fk_usersid, projectId]) => {
      if (acc[projectId]) {
        acc[projectId].push(fk_usersid)
      } else {
        acc[projectId] = [fk_usersid]
      }
      return acc
    },
    {} as { [projectId: number]: number[] },
  )

  let issues = await prisma.issues.findMany({})
  const issue_ids = issues.map((issue) => [issue.id, issue.fk_projectsid])
  const projectIssuesMap: { [projectId: number]: number[] } = issue_ids.reduce(
    (acc, [issueId, projectId]) => {
      if (acc[projectId]) {
        acc[projectId].push(issueId)
      } else {
        acc[projectId] = [issueId]
      }
      return acc
    },
    {} as { [projectId: number]: number[] },
  )

  let assigned = await prisma.gets_assigned.findMany({})
  let applied = await prisma.applies.findMany({})
  const allAssignments = assigned.concat(applied)
  const keyValueAssignments = allAssignments.map(
    ({ fk_issuesid, fk_usersid }) => [fk_issuesid, fk_usersid],
  )
  const projectUsersMap: { [projectId: number]: number[] } = {}
  keyValueAssignments.forEach(([fk_issuesid, fk_usersid]) => {
    let projectId: number | undefined
    for (const [id, issueIds] of Object.entries(projectIssuesMap)) {
      if (issueIds.includes(fk_issuesid)) {
        projectId = parseInt(id)
        break
      }
    }
    if (projectId !== undefined) {
      if (!projectUsersMap[projectId]) {
        projectUsersMap[projectId] = []
      }
      projectUsersMap[projectId].push(fk_usersid)
    }
  })
  const mergedMap: { [projectId: number]: number[] } = {}

  for (const projectId in projectFaultsMap) {
    if (projectFaultsMap.hasOwnProperty(projectId)) {
      mergedMap[projectId] = [
        ...(projectFaultsMap[projectId] || []),
        ...(projectUsersMap[projectId] || []),
      ]
    }
  }

  const volunteerCount: { [projectId: number]: number } = {}
  for (const projectId in mergedMap) {
    if (mergedMap.hasOwnProperty(projectId)) {
      const uniqueUserIds = new Set(mergedMap[projectId])
      volunteerCount[projectId] = uniqueUserIds.size
    }
  }
  return volunteerCount
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: Number } },
) {
  get_volunteer_count()
  let project = await prisma.projects.findUnique({
    where: { id: Number(params.id) },
    include: {
      images: true, // include related image data
    },
  })

  if (!project) {
    return new NextResponse(JSON.stringify({ message: 'Project not found' }), {
      status: 404,
    })
  }

  const volunteers: { [projectId: number]: number } =
    await get_volunteer_count()
  if (!volunteers) {
    return new NextResponse(
      JSON.stringify({ message: 'Error fetching volunteer count' }),
      {
        status: 500,
      },
    )
  }

  const volunteerCount = volunteers[project.id] ?? 0
  project.contributor_count = volunteerCount

  return NextResponse.json(project)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: Number } },
) {
  const formData = await request.formData()

  const name = formData.get('name') as string
  const short_description = formData.get('short_description') as string
  const long_description = formData.get('long_description') as string
  const repository = formData.get('repository') as string
  const technologies = formData.get('technologies') as string
  const star_count = Number(formData.get('star_count')) || 0
  const contributor_count = Number(formData.get('contributor_count')) || 0
  const codebase_visibility = formData.get('codebase_visibility') as string
  const image = (formData.get('image') as File) || null

  try {
    let imageId = null
    if (image) {
      const imageFormData = new FormData()
      imageFormData.append('image', image)

      const imageResponse = await fetch(
        `${process.env.BASE_URL}/api/image/upload`,
        {
          method: 'POST',
          body: imageFormData,
        },
      )

      if (!imageResponse.ok) {
        return new NextResponse(
          JSON.stringify({ message: 'Error uploading image' }),
          { status: 500 },
        )
      }

      const imageResponseData = await imageResponse.json()
      imageId = imageResponseData.upload.id_images
    }

    const project = await prisma.projects.update({
      where: { id: Number(params.id) },
      data: {
        name,
        short_description,
        long_description,
        repository,
        technologies,
        star_count,
        contributor_count,
        codebase_visibility,
        updated_at: new Date(),
        fk_imagesid_images: imageId,
      },
    })

    return new NextResponse(
      JSON.stringify({ message: 'Project updated successfully', project }),
      { status: 200 },
    )
  } catch (e: any) {
    return new NextResponse(
      JSON.stringify({ message: 'Error updating project', error: e.message }),
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: Number } }
) {
  const projectId = Number(params.id);

  try {
      await prisma.$transaction(async (prisma) => {
          const issueIds = (await prisma.issues.findMany({
              where: { fk_projectsid: projectId },
              select: { id: true }
          })).map(issue => issue.id);

          const faultIds = (await prisma.faults.findMany({
              where: { fk_projectsid: projectId },
              select: { id: true }
          })).map(fault => fault.id);

          await prisma.gets_assigned.deleteMany({
              where: {
                  fk_issuesid: { in: issueIds }
              }
          });

          await prisma.applies.deleteMany({
              where: {
                  fk_issuesid: { in: issueIds }
              }
          });

          await prisma.images.deleteMany({
              where: {
                  OR: [
                      { fk_faultsid: { in: faultIds } },
                      { fk_issuesid: { in: issueIds } }
                  ]
              }
          });

          await prisma.faults.deleteMany({
              where: { fk_projectsid: projectId }
          });

          await prisma.issues.deleteMany({
              where: { fk_projectsid: projectId }
          });

          await prisma.controls.deleteMany({
              where: { fk_projectsid: projectId }
          });

          await prisma.projects.delete({
              where: { id: projectId }
          });
      });

      return new NextResponse(
          JSON.stringify({ message: "Project deleted successfully" }),
          { status: 200 }
      );
  } catch (error) {
      console.error("Deletion error:", error);
      return new NextResponse(
          JSON.stringify({ message: "Error deleting project", error: error.message }),
          { status: 500 }
      );
  }
}
