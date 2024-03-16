"use server"

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";
import { CreateSafeAction } from "../../lib/create-safe-action";
import { UpdateBoardSchema } from "./schema";

const handler = async (data : InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
        return {
            errors: "Unauthorized"
        }
    }

    const { title, id } = data

    let board;

    try {
        board = await db.board.update(
            {
                data: {
                    title
                },
                where: {
                    id,
                    orgId
                }
            }
        )
    } catch(error) {
        console.log(error)
        return {
            errors: "Failed to update"
        }
    }

    revalidatePath(`/board/${id}`)
    return {data : board}
}

export const updateBoard = CreateSafeAction(UpdateBoardSchema, handler)