"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createPost(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const content = String(formData.get("content") ?? "");

  const post = await prisma.post.create({
    data: {
      title,
      content,
      status: "Processing",
    },
  });

  revalidatePath("/");

  await fetch("http://localhost:3000/api/workflows/post", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(post),
  });

  return post;
}
