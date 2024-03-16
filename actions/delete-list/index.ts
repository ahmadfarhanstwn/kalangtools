"use server"

import { auth } from "@clerk/nextjs";
import { ReturnType, InputType } from "./types";
import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";
import { CreateSafeAction } from "../../lib/create-safe-action";
import { DeleteListSchema } from "./schema";

const handler = async (data : InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
        return {
            errors: "Unauthorized"
        }
    }

    const { boardId, id } = data

    let list;

    try {
        list = await db.list.delete(
            {
                where: {
                    id,
                    boardId,
                    board: {
                        orgId
                    }
                }
            }
        )
    } catch(error) {
        console.log(error)
        return {
            errors: "Failed to delete"
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data : list}
}

export const deleteList = CreateSafeAction(DeleteListSchema, handler)