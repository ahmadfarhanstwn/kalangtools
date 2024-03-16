"use client"

import { Popover, PopoverContent, PopoverTrigger } from "../../../../../../components/ui/popover";
import { ListWithCard } from "../../../../../../types"
import { Button } from "../../../../../../components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { FormSubmit } from "../../../../../../components/form/form-submit";
import { Separator } from "../../../../../../components/ui/separator";
import { useAction } from "../../../../../../hooks/use-action";
import { deleteList } from "../../../../../../actions/delete-list";
import { toast } from "sonner";
import { copyList } from "../../../../../../actions/copy-list";

interface ListOptionsProps {
    data : ListWithCard;
    onAddCard: () => void
}

export const ListOptions = ({data, onAddCard} : ListOptionsProps) => {
    const { execute : executeDelete } = useAction(deleteList, {
        onSuccess: (data) => {
            toast.success(`List ${data.title} succesfully deleted`)
        },
        onError: (error) => {
            toast.error(error)
        }
    })

    const { execute : executeCopy } = useAction(copyList, {
        onSuccess: (data) => {
            toast.success(`List ${data.title} succesfully copied`)
        },
        onError: (error) => {
            toast.error(error)
        }
    })

    const onDelete = (formData : FormData) => {
        const id = formData.get("id") as string;
        const boardId = formData.get("boardId") as string;

        executeDelete({ boardId, id })
    }

    const onCopy = (formData : FormData) => {
        const id = formData.get("id") as string;
        const boardId = formData.get("boardId") as string;

        executeCopy({ boardId, id })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="h-auto w-auto p-2" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    List Actions
                </div>
                <Button onClick={onAddCard} className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm" variant="ghost">
                    Add a card...
                </Button>
                <form action={onCopy}>
                    <input hidden id="id" name="id" value={data.id} />
                    <input hidden id="boardId" name="boardId" value={data.boardId} />
                    <FormSubmit
                        variant="ghost"
                        className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                    >
                        Copy list...
                    </FormSubmit>
                </form>
                <Separator />
                <form action={onDelete}>
                    <input hidden id="id" name="id" value={data.id} />
                    <input hidden id="boardId" name="boardId" value={data.boardId} />
                    <FormSubmit
                        variant="ghost"
                        className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                    >
                        Delete the list...
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    )
}