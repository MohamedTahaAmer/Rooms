// >(6:20)
import type { Vote } from "@prisma/client";

export type CachedPost = {
  id: string;
  title: string;
  authorUsername: string;
  content: string;
  currentVote: Vote["type"] | null;
  createdAt: Date;
};

// these types arn't available globally, you must import them
