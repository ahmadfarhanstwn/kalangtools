"use server"

import { auth } from "@clerk/nextjs";
import { ReturnType, InputType } from "./types";
import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";
import { CreateSafeAction } from "../../lib/create-safe-action";
import { UpdateListOrderSchema } from "./schema";

const handler = async (data : InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
        errors: "Unauthorized",
        };
    }

    const { items, boardId } = data;
    let lists;

    try {
        const transaction = items.map((list) => 
        db.list.update({
            where: {
            id: list.id,
            board: {
                orgId,
            },
            },
            data: {
            order: list.order,
            },
        })
        );

        lists = await db.$transaction(transaction);
    } catch (error) {
        return {
        errors: "Failed to reorder."
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: lists };
}

export const updateListOrder = CreateSafeAction(UpdateListOrderSchema, handler)