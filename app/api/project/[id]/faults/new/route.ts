import prisma from '@/app/utils/prisma/client'
import { sendFaultNotifEmail } from '@/lib/mail'
import { faults_severity, faults_status } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    const data = await req.json()
    const {
      title,
      description,
      severity,
      status,
      id_project,
      user_id,
    }: {
      title: string
      description: string
      severity: string
      status: string
      id_project: number
      user_id: number
    } = data

    try {
      const fault = await prisma.faults.create({
        data: {
          title,
          created_at: new Date(),
          description,
          severity: severity as faults_severity, // Explicitly type the 'severity' property
          status: status as faults_status, // Explicitly type the 'status' property
          fk_projectsid: id_project as number,
          fk_usersid: user_id as number,
        },
      })

      const emails = await getProjectOwnerEmails(id_project)
      const projectName = await getProjectName(id_project)
      await sendFaultNotifEmail(emails, id_project, fault.id, projectName)

      const updateProject = await prisma.projects.update({
        where: { id: Number(id_project) },
        data: {
          updated_at: new Date(),
        },
      })

      return new NextResponse(
        JSON.stringify({ message: 'Fault created successfully', fault }),
        { status: 201 },
      )
    } catch (error: any) {
      return new NextResponse(
        JSON.stringify({
          message: 'Error creating fault',
          error: error.message,
        }),
        { status: 500 },
      )
    }
  } else {
    return new NextResponse(
      JSON.stringify({ message: `Method ${req.method} Not Allowed` }),
      { status: 405 },
    )
  }
}

async function getProjectName(projectId: number): Promise<string> {
  try {
    const project = await prisma.projects.findUnique({
      where: { id: projectId },
      select: { name: true },
    })

    return project?.name || ''
  } catch (error) {
    console.error('Error fetching project name:', error)
    return ''
  }
}

async function getProjectOwnerEmails(projectId: number): Promise<string[]> {
  try {
    let admins = await prisma.controls.findMany({
      where: { fk_projectsid: Number(projectId) },
    })

    if (!admins || admins.length === 0) {
      return []
    }

    const adminUserIds = admins.map((admin: any) => admin.fk_usersid)

    const users = await prisma.users.findMany({
      where: {
        id: { in: adminUserIds },
      },
      select: {
        email: true,
      },
    })

    const emails = users
      .map((user) => user.email)
      .filter((email): email is string => email !== null)
    return emails
  } catch (error) {
    console.error('Error fetching controls:', error)
    return []
  }
}
