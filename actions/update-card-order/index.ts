"use server"

import { auth } from "@clerk/nextjs";
import { ReturnType, InputType } from "./types";
import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";
import { CreateSafeAction } from "../../lib/create-safe-action";
import { UpdateCardOrderSchema } from "./schema";

const handler = async (data : InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
        errors: "Unauthorized",
        };
    }

    const { items, boardId, } = data;
    let updatedCards;

    try {
        const transaction = items.map((card) => 
        db.card.update({
            where: {
            id: card.id,
            list: {
                board: {
                orgId,
                },
            },
            },
            data: {
            order: card.order,
            listId: card.listId,
            },
        }),
        );

        updatedCards = await db.$transaction(transaction);
    } catch (error) {
        return {
        errors: "Failed to reorder."
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: updatedCards };
}

export const updateCardOrder = CreateSafeAction(UpdateCardOrderSchema, handler)