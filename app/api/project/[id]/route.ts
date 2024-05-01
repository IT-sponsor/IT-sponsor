import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: Number } }
) {
    let project = await prisma.projects.findUnique({
        where: { id: Number(params.id) },
        include: {
            images: true, // include related image data
        },
    });

    if (!project) {
      return new NextResponse(
        JSON.stringify({ message: "Project not found" }),
        { status: 404 }
      );
    }
    return NextResponse.json(project);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: Number } }
) {
  console.log(request.body);
  const formData = await request.formData();
  console.log(formData);

  const name = formData.get("name") as string;
  const short_description = formData.get("short_description") as string;
  const long_description = formData.get("long_description") as string;
  const repository = formData.get("repository") as string;
  const technologies = formData.get("technologies") as string;
  const star_count = Number(formData.get("star_count")) || 0;
  const contributor_count = Number(formData.get("contributor_count")) || 0;
  const codebase_visibility = formData.get("codebase_visibility") as string;
  const image = (formData.get("image") as File) || null;

  try {
    let imageId = null;
    if (image) {
      const imageFormData = new FormData();
      imageFormData.append("image", image);

      const imageResponse = await fetch(
        `${process.env.BASE_URL}/api/image/upload`,
        {
          method: "POST",
          body: imageFormData,
        }
      );

      if (!imageResponse.ok) {
        return new NextResponse(
          JSON.stringify({ message: "Error uploading image" }),
          { status: 500 }
        );
      }

      const imageResponseData = await imageResponse.json();
      imageId = imageResponseData.upload.id_images;
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
    });

    console.log("Project updated", project);
    return new NextResponse(
      JSON.stringify({ message: "Project updated successfully", project }),
      { status: 200 }
    );
  } catch (e: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error updating project", error: e.message }),
      { status: 500 }
    );
  }

  // const data = await request.json();
  // try {
  //     const updatedProject = await prisma.projects.update({
  //         where: { id: Number(params.id) },
  //         data: {
  //             name: data.name,
  //             short_description: data.short_description,
  //             long_description: data.long_description,
  //             repository: data.repository,
  //             technologies: data.technologies,
  //             codebase_visibility: data.codebase_visibility,
  //         },
  //         include: {
  //             images: true,
  //         },
  //     });
  //     return NextResponse.json(updatedProject);
  // } catch (error) {
  //     return new NextResponse(JSON.stringify({ message: "Error updating project", error: error.message }), { status: 500 });
  // }
}
