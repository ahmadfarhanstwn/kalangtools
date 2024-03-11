import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"
import React from "react"

const PlatformLayout = ({children} : {children: React.ReactNode}) => {
    return (
        <ClerkProvider>
            <Toaster />
            {children}
        </ClerkProvider>
    )
}

export default PlatformLayout