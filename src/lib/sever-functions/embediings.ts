"use server";

import { Mistral } from "@mistralai/mistralai";

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function createEmbeddings(
  title: string
) {
  const response =
    await client.embeddings.create({
      model: "mistral-embed",
      inputs: [title],
    });

  return response.data[0].embedding;
}