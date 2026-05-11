import { auth } from "@/lib/auth";
import { semanticSearch } from "@/lib/sever-functions/semanticSearch";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const MAX_SEARCH_RESULTS = 20;
const DEFAULT_MAX_DISTANCE = 0.75;

async function getUserId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user.id;
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, data: [], message: "Unauthorized" },
        { status: 401 },
      );
    }

    const query = req.nextUrl.searchParams.get("query")?.trim() ?? "";
    if (!query) {
      return NextResponse.json(
        { success: true, data: [], message: "Search query is empty" },
        { status: 200 },
      );
    }

    const limitParam = Number(req.nextUrl.searchParams.get("limit"));
    const limit =
      Number.isFinite(limitParam) && limitParam > 0
        ? Math.min(limitParam, MAX_SEARCH_RESULTS)
        : 10;

    const maxDistanceParam = Number(req.nextUrl.searchParams.get("maxDistance"));
    const maxDistance =
      Number.isFinite(maxDistanceParam) && maxDistanceParam > 0
        ? maxDistanceParam
        : DEFAULT_MAX_DISTANCE;

    const results = await semanticSearch(query, userId, limit, maxDistance);

    return NextResponse.json(
      { success: true, data: results, message: "Search completed" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, data: [], message: "Server side error" },
      { status: 500 },
    );
  }
}
