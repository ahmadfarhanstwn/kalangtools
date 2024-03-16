import {z} from "zod"

export const DeleteListSchema = z.object({
    boardId: z.string(),
    id: z.string()
})