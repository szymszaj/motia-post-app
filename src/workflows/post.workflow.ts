import { prisma } from "@/lib/prisma";
import { Post, WorkflowStep } from "./types";

class PostWorkflow {
  private steps: WorkflowStep[] = [];

  addStep(name: string, execute: () => Promise<unknown>) {
    this.steps.push({ name, execute });
    return this;
  }

  async run() {
    const results = [];
    for (const step of this.steps) {
      console.log(`[INFO] Executing step: ${step.name}`);
      const result = await step.execute();
      results.push({ step: step.name, result });
    }
    return results;
  }
}

export async function postWorkflow(post: Post) {
  try {
    const workflow = new PostWorkflow();

    workflow
      .addStep("enrich-post", async () => {
        console.log(`[INFO] Enriching post: ${post.title}`);
        // TODO: implement real enrichment logic (e.g. AI tagging)
        await new Promise((resolve) => setTimeout(resolve, 100));
        return { enriched: true };
      })
      .addStep("localize-post", async () => {
        console.log(`[INFO] Localizing post: ${post.id}`);
        // TODO: implement real localization logic
        await new Promise((resolve) => setTimeout(resolve, 100));
        return { localized: true };
      })
      .addStep("search-optimization", async () => {
        console.log(`[INFO] Optimizing post for search: ${post.id}`);
        // TODO: implement real SEO/search optimization
        await new Promise((resolve) => setTimeout(resolve, 100));
        return { optimized: true };
      });

    const results = await workflow.run();

    await prisma.post.update({
      where: { id: post.id },
      data: { status: "Completed" },
    });

    return { success: true, postId: post.id, steps: results };
  } catch (error) {
    console.error(`[ERROR] Workflow failed for post ${post.id}:`, error);

    await prisma.post
      .update({
        where: { id: post.id },
        data: { status: "Failed" },
      })
      .catch((dbErr) =>
        console.error(`[ERROR] Could not update post status to Failed:`, dbErr),
      );

    return {
      success: false,
      postId: post.id,
      status: "Failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
