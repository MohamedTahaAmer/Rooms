import { z } from 'zod'

// - the validator is used to insure type safty on the server side
export const SubredditValidator = z.object({
  name: z.string().min(3).max(21),
})

export const SubredditSubscriptionValidator = z.object({
  subredditId: z.string(),
})

// - the payload is just a type and it is used to get type completion and warnings on the client side
export type CreateSubredditPayload = z.infer<typeof SubredditValidator>
export type SubscribeToSubredditPayload = z.infer<
  typeof SubredditSubscriptionValidator
>
