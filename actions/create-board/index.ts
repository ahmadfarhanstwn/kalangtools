"use server"

import { auth } from "@clerk/nextjs";
import { ReturnType, InputType } from "./types";
import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";
import { CreateSafeAction } from "../../lib/create-safe-action";
import { CreateBoardSchema } from "./schema";

const handler = async (data : InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
        return {
            errors: "Unauthorized"
        }
    }

    const { title, image } = data

    const [
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName
      ] = image.split("|");

    if (!imageId || !imageThumbUrl || !imageFullUrl || !imageUserName || !imageLinkHTML) {
        return {
            errors: "Missing fields. Failed to create board."
        };
    }

    let board;

    try {
        board = await db.board.create(
            {
                data: {
                    title,
                    orgId,
                    imageId,
                    imageThumbUrl,
                    imageFullUrl,
                    imageUserName,
                    imageLinkHTML,
                }
            }
        )
    } catch(error) {
        console.log(error)
        return {
            errors: "Failed to create"
        }
    }

    revalidatePath(`/board/${board.id}`)
    return {data : board}
}

export const createBoard = CreateSafeAction(CreateBoardSchema, handler)