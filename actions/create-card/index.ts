"use server"

import { auth } from "@clerk/nextjs";
import { ReturnType, InputType } from "./types";
import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";
import { CreateSafeAction } from "../../lib/create-safe-action";
import { CreateCardSchema } from "./schema";

const handler = async (data : InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
        return {
            errors: "Unauthorized"
        }
    }

    const { title, listId, boardId } = data

    let card;

    try {
        const list = await db.list.findUnique({
            where: {
              id: listId,
              board: {
                orgId,
              },
            },
          });
      
        if (!list) {
            return {
                errors: "List not found",
            };
        }

        const lastCard = await db.card.findFirst({
            where: {
                listId
            },
            orderBy: {
                order: "desc"
            },
            select: {
                order: true
            }
        })

        const newOrder = lastCard ? lastCard.order + 1 : 1;

        card = await db.card.create(
            {
                data: {
                    title,
                    order: newOrder,
                    listId,
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
    return {data : card}
}

export const createCard = CreateSafeAction(CreateCardSchema, handler)