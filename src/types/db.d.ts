// >(5:05) defining a new schema for our extendedPost
import type { Post, Subreddit, User, Vote, Comment } from '@prisma/client'

export type ExtendedPost = Post & {
  subreddit: Subreddit
  votes: Vote[]
  author: User
  comments: Comment[]
}
