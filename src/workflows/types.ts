export type Post = {
  id: number;
  title: string;
  content: string;
  status: string;
  createdAt: Date;
};

export type WorkflowStep = {
  name: string;
  execute: () => Promise<unknown>;
};
