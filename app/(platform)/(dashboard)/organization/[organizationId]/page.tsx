import { Separator } from "../../../../../components/ui/separator";
import { db } from "../../../../../lib/db";
import { BoardList } from "./_components/board-list";
import { Info } from "./_components/info";

const OrganizationIdPage = async () => {
    const boards = await db.board.findMany()

    return ( 
        <div className="flex flex-col space-y-4">
            <Info />
            <Separator className="my-4" />
            <div className="px-2 md:px-4">
                <BoardList />
            </div>
        </div>
     );
}
 
export default OrganizationIdPage;