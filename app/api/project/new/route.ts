import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { projects_codebase_visibility } from "@prisma/client";

export async function POST(req: NextRequest) {
  console.log("POST /api/project/new");
  const formData = await req.formData();
  
  const name = formData.get("name") as string;
  const short_description = formData.get("short_description") as string;
  const long_description = formData.get("long_description") as string;
  const repository = formData.get("repository") as string;
  const technologies = formData.get("technologies") as string;
  const star_count = Number(formData.get("star_count")) || 0;
  const contributor_count = Number(formData.get("contributor_count")) || 0;
  const codebase_visibility = formData.get("codebase_visibility") as projects_codebase_visibility || projects_codebase_visibility.public;
  const image = formData.get("image") as File || null;

  

  try {
    let imageId = null;
    if(image) {
      const imageFormData = new FormData();
      imageFormData.append("image", image);
      console.log("imageFormData", imageFormData)

      const imageResponse = await fetch("http://localhost:3000/api/image/upload", {
        method: "POST",
        body: imageFormData,
      });

      if (!imageResponse.ok) {
        return new NextResponse(
          JSON.stringify({ message: "Error uploading image" }),
          { status: 500 }
        );
      }

      const imageResponseData = await imageResponse.json();
      imageId = imageResponseData.upload.id_images;
    }

    const project = await prisma.projects.create({
      data: {
        name,
        short_description,
        long_description,
        repository,
        technologies,
        star_count,
        contributor_count,
        codebase_visibility,
        created_at: new Date(),
        updated_at: new Date(),
        fk_imagesid_images: imageId,
      },
    });

    console.log("Project created", project);
    return new NextResponse(
      JSON.stringify({ message: "Project created successfully", project }),
      { status: 201 }
    );
  
  } catch (e: any) {
    console.error("Error while trying to create project\n", e);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong." }),
      { status: 500 }
    );
  }
}