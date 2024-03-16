import {z} from "zod"

export const CopyListSchema = z.object({
    boardId: z.string(),
    id: z.string()
})