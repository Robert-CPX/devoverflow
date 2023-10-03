import * as z from "zod"

const QuestionsSchema = z.object({
  title: z.string().min(3).max(130),
  detail:z.string().nonempty(),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
})

export { QuestionsSchema }