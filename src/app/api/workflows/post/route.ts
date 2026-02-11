import { NextResponse } from "next/server";
import { postWorkflow } from "@/workflows/post.workflow";

export async function POST(request: Request) {
  try {
    const post = await request.json();

    const result = await postWorkflow(post);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Workflow error:", error);
    return NextResponse.json({ error: "Workflow failed" }, { status: 500 });
  }
}
