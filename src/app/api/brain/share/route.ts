import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

import { getUserId } from '../../contents/route';

export const GET = async (req: NextRequest) => {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    const hash = req.nextUrl.searchParams.get('hash');

    if (!hash) {
      return NextResponse.json(
        {
          success: false,
          message: 'Hash is required',
        },
        { status: 400 },
      );
    }

    const link = await prisma.link.findFirst({
      where: {
        userId,
        hash,
      },
    });

    return NextResponse.json({
      success: true,
      data: link,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong',
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

          message: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    const { share } = await req.json();

    if (share) {
      const exhistingLink = await prisma.link.findFirst({
        where: {
          userId,
        },
      });

      if (exhistingLink) {
        return NextResponse.json({
          success: true,
          data: { hash: exhistingLink.hash },
        });
      }

      const hash = crypto.randomUUID();
      const link = await prisma.link.create({
        data: {
          userId,
          hash,
        },
      });

      return NextResponse.json({
        success: true,
        data: link,
        message: 'Share link created',
      });
    }

    await prisma.link.deleteMany({
      where: {
        userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Share link deleted',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong',
      },
      { status: 500 },
    );
  }
};
