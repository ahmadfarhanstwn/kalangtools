"use server"

import { revalidatePath } from "next/cache"
import { db } from "../lib/db"

export async function deleteBoard(id : string) {
    await db.board.delete({
        where: {
            id: id
        }
    })

    revalidatePath("organization/org_2dTTok2W3zLAlA6wvEsiJHIzs31")
}