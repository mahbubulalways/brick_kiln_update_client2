import DriverPage from "@/components/Pages/DriverPage/DriverPage";
import PrivateComponent from "@/components/Reusable/PrivateComponent";
import { TQuerySearch } from "@/interface/query";
import { modifyQuery } from "@/utils/modifyQuery";

export default async function page({ searchParams }: TQuerySearch) {
    const query = await searchParams
    const { currentLimit, currentPage, currentSearch } = modifyQuery(query)
    return (
        <PrivateComponent feature="DRIVER">
            <DriverPage
                limit={currentLimit}
                page={currentPage}
                search={currentSearch}

            />
        </PrivateComponent >
    )
}
