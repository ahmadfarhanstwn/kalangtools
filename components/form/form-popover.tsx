"use client"

import React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormInput } from "./form-input";
import { FormSubmit } from "./form-submit";
import { useAction } from "../../hooks/use-action";
import { createBoard } from "../../actions/create-board";
import { toast } from "sonner";

interface FormPopoverProps {
    children: React.ReactNode;
    side?: "left" | "right" | "top" | "bottom";
    align?: "start" | "center" | "end";
    sideOffset?: number
}

export const FormPopover = ({children, side = "bottom", align, sideOffset = 0} : FormPopoverProps) => {
    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess: () => {
            console.log("success")
            toast.success("Board created!")
        },
        onError: (error) => {
            console.error(error)
            toast.error(error)
        },
    })

    const onSubmit = (formData : FormData) => {
        const title = formData.get("title") as string;

        execute({ title })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent align={align} side={side} sideOffset={sideOffset} className="w-80 pt-3">
                <div className="text-sm font-medium text-center text-neutrak-600">
                    Create Board
                </div>
                <form className="space-y-4" action={onSubmit}>
                    <div className="space-y-4">
                        <FormInput id="title" label="Board title" type="text" errors={fieldErrors} />
                    </div>
                    <FormSubmit className="w-full">
                        Create
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    )
}