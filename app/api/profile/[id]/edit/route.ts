import { NextRequest, NextResponse } from "next/server";
import { hash } from 'bcrypt';
import prisma from "@/app/utils/prisma/client";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: Number } }
) {

  function handleNull(value: string): string | null {
    return value === 'null' ? null : value;
  }

  const formData = await request.formData();

  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const github = handleNull(formData.get("github") as string);
  const linkedin = handleNull(formData.get("linkedin") as string);
  const phone_number = handleNull(formData.get("phone_number") as string);
  const job_title = handleNull(formData.get("job_title") as string);
  const about_me = handleNull(formData.get("about_me") as string);
  const technologies = handleNull(formData.get("technologies") as string);
  const experience = handleNull(formData.get("experience") as string);
  const education = handleNull(formData.get("education") as string);

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

    const existingUserByEmail = await prisma.users.findUnique({
      where: { email: email },
    });
    if (existingUserByEmail && existingUserByEmail.id !== Number(params.id)) {
      return new NextResponse(JSON.stringify({ message: "Email already exists" }), { status: 409 });
    }

    let existingUserByGithub = null;
    if (github !== null) {
      existingUserByGithub = await prisma.users.findUnique({
        where: { github: github },
      });
      if (existingUserByGithub && existingUserByGithub.id !== Number(params.id)) {
        return new NextResponse(JSON.stringify({ message: 'GitHub username already exists' }), { status: 409 });
      }
    }

    let existingUserByLinkedin = null;
    if (linkedin !== null) {
      existingUserByLinkedin = await prisma.users.findUnique({
        where: { linkedin: linkedin },
      });
      if (existingUserByLinkedin && existingUserByLinkedin.id !== Number(params.id)) {
        return new NextResponse(JSON.stringify({ message: 'LinkedIn already exists' }), { status: 409 });
      }
    }

    let existingUserByNumber = null;
    if (phone_number !== null) {
      existingUserByNumber = await prisma.users.findUnique({
        where: { phone_number: phone_number },
      });
      if (existingUserByNumber && existingUserByNumber.id !== Number(params.id)) {
        return new NextResponse(JSON.stringify({ message: 'Phone number already exists' }), { status: 409 });
      }
    }

    const updateData: { [key: string]: any } = {
      first_name,
      last_name,
      email: existingUserByEmail ? existingUserByEmail.email : email,
      github: existingUserByGithub ? existingUserByGithub.github : github,
      linkedin: existingUserByLinkedin ? existingUserByLinkedin.linkedin : linkedin,
      phone_number: existingUserByNumber ? existingUserByNumber.phone_number : phone_number,
      about_me,
      job_title,
      technologies,
      experience,
      education,
      fk_imagesid_images: imageId
    };

    if (password !== 'undefined') {
      updateData.password = await hash(password, 10);
    }

    const profile = await prisma.users.update({
      where: { id: Number(params.id) },
      data: updateData,
    });

    return new NextResponse(
      JSON.stringify({ message: "Profile updated successfully", profile }),
      { status: 200 }
    );
  } catch (e: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error updating profile", error: e.message }),
      { status: 500 }
    );
  }
}