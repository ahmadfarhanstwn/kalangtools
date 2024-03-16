"use client"

import { MoreHorizontal, X } from "lucide-react"
import { Button } from "../../../../../../components/ui/button"
import { Popover, PopoverContent, PopoverTrigger,  } from "../../../../../../components/ui/popover"
import { useAction } from "../../../../../../hooks/use-action"
import { deleteBoard } from "../../../../../../actions/delete-board"
import { toast } from "sonner"

interface BoardOptionsProps {
    id : string
}

export const BoardOptions = ({id} : BoardOptionsProps) => {
    const { execute, isLoading } = useAction(deleteBoard, {
        onError: (error) => {
            toast.error(error)
        }
    })

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="h-auto w-auto p-2" variant="transparent">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="px-0 pt-3 pb-3"
                side="bottom"
                align="start"
            >
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    Board actions
                </div>
                <Button
                    variant="ghost"
                    onClick={() => {
                        execute({id})
                    }}
                    disabled={isLoading}
                    className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                >
                    Delete this board
                </Button>
            </PopoverContent>
        </Popover>
    )
}