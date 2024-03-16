"use server"

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";
import { CreateSafeAction } from "../../lib/create-safe-action";
import { DeleteBoardSchema } from "./schema";
import { redirect } from "next/navigation";

const handler = async (data : InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
        return {
            errors: "Unauthorized"
        }
    }

    const { id } = data

    let board;

    try {
        board = await db.board.delete(
            {
                where: {
                    id,
                    orgId
                }
            }
        )
    } catch(error) {
        console.log(error)
        return {
            errors: "Failed to delete"
        }
    }

    revalidatePath(`/organization/${orgId}`)
    redirect(`/organization/${orgId}`)
}

export const deleteBoard = CreateSafeAction(DeleteBoardSchema, handler)