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
  const workflow = new PostWorkflow();

  workflow
    .addStep("enrich-post", async () => {
      console.log(`[INFO] Enriching post: ${post.title}`);
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { enriched: true };
    })
    .addStep("localize-post", async () => {
      console.log(`[INFO] Localizing post: ${post.id}`);
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { localized: true };
    })
    .addStep("search-optimization", async () => {
      console.log(`[INFO] Optimizing post for search: ${post.id}`);
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { optimized: true };
    });

  const results = await workflow.run();
  return { success: true, postId: post.id, steps: results };
}
