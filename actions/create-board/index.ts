"use server"

import { auth } from "@clerk/nextjs";
import { ReturnType, InputType } from "./types";
import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";
import { CreateSafeAction } from "../../lib/create-safe-action";
import { CreateBoardSchema } from "./schema";

const handler = async (data : InputType): Promise<ReturnType> => {
    const { userId } = auth()

    if (!userId) {
        return {
            errors: "Unauthorized"
        }
    }

    const { title } = data

    let board;

    try {
        board = await db.board.create(
            {
                data: {
                    title: title
                }
            }
        )
    } catch(error) {
        return {
            errors: "Failed to create"
        }
    }

    revalidatePath(`/board/${board.id}`)
    return {data : board}
}

export const createBoard = CreateSafeAction(CreateBoardSchema, handler)