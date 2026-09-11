import TodaysInVoicePage from "@/components/Pages/Invoice/TodaysInvoice/TodaysInvoice"
import PrivateComponent from "@/components/Reusable/PrivateComponent";
import { TQuerySearch } from "@/interface/query"
import { modifyQuery } from "@/utils/modifyQuery";

const Page = async ({ searchParams }: TQuerySearch) => {
    const query = await searchParams
    const { currentLimit, currentPage, currentSearch } = modifyQuery(query);
    return (
        <PrivateComponent feature="INVOICE">
            <TodaysInVoicePage limit={currentLimit} page={currentPage} search={currentSearch} />
        </PrivateComponent>
    )
}

export default Page