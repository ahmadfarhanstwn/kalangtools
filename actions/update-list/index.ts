"use server"

import { auth } from "@clerk/nextjs";
import { ReturnType, InputType } from "./types";
import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";
import { CreateSafeAction } from "../../lib/create-safe-action";
import { UpdateListSchema } from "./schema";

const handler = async (data : InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
        return {
            errors: "Unauthorized"
        }
    }

    const { title, boardId, id } = data

    let list;

    try {
        list = await db.list.update(
            {
                data: {
                    title,
                },
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
            errors: "Failed to update"
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data : list}
}

export const updateList = CreateSafeAction(UpdateListSchema, handler)