"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { PostSchema } from "@/lib/schemas";
import { ZodError } from "zod";

export type ActionState = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createPost(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    title: String(formData.get("title") ?? ""),
    content: String(formData.get("content") ?? ""),
  };

  const parsed = PostSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const [field, messages] of Object.entries(
      parsed.error.flatten().fieldErrors,
    )) {
      fieldErrors[field] = messages as string[];
    }
    return { success: false, fieldErrors };
  }

  try {
    const post = await prisma.post.create({
      data: {
        title: parsed.data.title,
        content: parsed.data.content,
        status: "Processing",
      },
    });

    revalidatePath("/");

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const workflowRes = await fetch(`${baseUrl}/api/workflows/post`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(post),
    });

    if (!workflowRes.ok) {
      console.error("Workflow trigger failed:", await workflowRes.text());
    }

    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: "Błąd walidacji danych." };
    }
    console.error("createPost error:", error);
    return {
      success: false,
      error: "Nie udało się zapisać posta. Spróbuj ponownie.",
    };
  }
}

export async function deletePost(id: number): Promise<ActionState> {
  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("deletePost error:", error);
    return { success: false, error: "Nie udało się usunąć posta." };
  }
}
