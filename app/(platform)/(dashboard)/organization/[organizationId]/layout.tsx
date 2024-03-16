import { startCase } from "lodash";

import React from "react";
import { OrganizationControl } from "./_components/org-control";
import { auth } from "@clerk/nextjs";

export async function generateMetaData() {
    const { orgSlug } = auth()
    return {
        title: startCase(orgSlug || "organization")
    }
}

const OrganizationIdLayout = ({children}: {children: React.ReactNode}) => {
    return ( 
        <>
            <OrganizationControl />
            {children}
        </>
     );
}
 
export default OrganizationIdLayout;