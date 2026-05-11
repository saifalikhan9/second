import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createEmbeddings } from "@/lib/sever-functions/embediings";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const getUserId = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user.id;
};

export const GET = async () => {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          data: [],
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const contents = await prisma.content.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: contents,
        message: "Fetched Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        data: [],
        message: "Server side error",
      },
      { status: 500 },
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const body = await req.json();

    const { type, title, link } = body;

    if (!type || !title || !link) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 },
      );
    }

    const embedding = await createEmbeddings(title);
    if (!embedding)
      return NextResponse.json({
        success: false,
        message: "Failed in generating embedings ",
      });

    const [content] = await prisma.$queryRaw<any[]>`
      INSERT INTO "Content"
      (
        id,
        title,
        link,
        type,
        embedding,
        "userId",
        "createdAt",
        "updatedAt"
      )
      VALUES
      (
        gen_random_uuid(),
        ${title},
        ${link},
        ${type},
        ${JSON.stringify(embedding)}::vector,
        ${userId},
        NOW(),
        NOW()
      )
      RETURNING *;
    `;

    return NextResponse.json(
      {
        success: true,
        data: content,
        message: "Content created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server side error",
      },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const body = await req.json();

    const { id } = body;

    console.log(id);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Content id is required",
        },
        { status: 400 },
      );
    }

    const existingContent = await prisma.content.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingContent) {
      return NextResponse.json(
        {
          success: false,
          message: "Content not found",
        },
        { status: 404 },
      );
    }

    await prisma.content.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Content deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server side error",
      },
      { status: 500 },
    );
  }
};
