"use server";

import prisma from "../prisma";
import { createEmbeddings } from "./embediings";

export type SemanticSearchResult = {
  id: string;
  title: string;
  link: string;
  type: "twitter" | "youtube" | "linkedin";
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  distance: number;
};

export async function semanticSearch(
  query: string,
  userId: string,
  limit = 10,
  maxDistance = 0.03,
) {
  const embedding = await createEmbeddings(query);
  const embeddingVector = JSON.stringify(embedding);

  const result = await prisma.$queryRaw<SemanticSearchResult[]>`
    SELECT *,
    embedding <=> ${embeddingVector}::vector AS distance
    FROM "Content"
    WHERE "userId" = ${userId}
      AND embedding <=> ${embeddingVector}::vector <= ${maxDistance}
    ORDER BY distance
    LIMIT ${limit};
  `;

  return result;
}
