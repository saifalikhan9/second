import { getUserId } from '@/app/api/contents/route';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
  params: Promise<{
    hash: string;
  }>;
};

export const GET = async (req: NextRequest, { params }: Params) => {
  try {
    const { hash } = await params;

    const link = await prisma.link.findFirst({
      where: {
        hash,
      },
    });

    if (!link) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid share link',
        },
        { status: 411 },
      );
    }

    const contents = await prisma.content.findMany({
      where: {
        userId: link.userId,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: link.userId,
      },
      select: {
        name: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: { username: user?.name, contents },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Server error',
      },
      { status: 500 },
    );
  }
};
