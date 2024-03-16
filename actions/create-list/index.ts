"use server"

import { auth } from "@clerk/nextjs";
import { ReturnType, InputType } from "./types";
import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";
import { CreateSafeAction } from "../../lib/create-safe-action";
import { CreateListSchema } from "./schema";

const handler = async (data : InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
        return {
            errors: "Unauthorized"
        }
    }

    const { title, boardId } = data

    let list;

    try {
        const lastList = await db.list.findFirst({
            where: {
                boardId
            },
            orderBy: {
                order: "desc"
            },
            select: {
                order: true
            }
        })

        const newOrder = lastList ? lastList.order + 1 : 1;

        list = await db.list.create(
            {
                data: {
                    title,
                    order: newOrder,
                    boardId,
                }
            }
        )
    } catch(error) {
        console.log(error)
        return {
            errors: "Failed to create"
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data : list}
}

export const createList = CreateSafeAction(CreateListSchema, handler)