import React from "react";
import { OrganizationControl } from "./_components/org-control";

const OrganizationIdLayout = ({children}: {children: React.ReactNode}) => {
    return ( 
        <>
            <OrganizationControl />
            {children}
        </>
     );
}
 
export default OrganizationIdLayout;