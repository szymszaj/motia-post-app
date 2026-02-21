import { Post as PrismaPost } from "@prisma/client";

export type Post = PrismaPost;

export type WorkflowStep = {
  name: string;
  execute: () => Promise<unknown>;
};
