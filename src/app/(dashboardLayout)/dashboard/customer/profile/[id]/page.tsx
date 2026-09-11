import CustomerDetailsPage from "@/components/Pages/CustomerPage/CustomerDetails/CustomerDetailsPage";
import PrivateComponent from "@/components/Reusable/PrivateComponent";
import { TParams, TQuerySearch } from "@/interface/query";
import { modifyQuery } from "@/utils/modifyQuery";

const Page = async ({
    params,
    searchParams,
}: TParams & TQuerySearch) => {
    const { id } = await params;

    const query = await searchParams;
    const { currentLimit, currentPage } = modifyQuery(query)
    return (
        <PrivateComponent feature="CUSTOMER">
            <CustomerDetailsPage
                id={id}
                query={{ limit: currentLimit, page: currentPage }}
            />
        </PrivateComponent>
    );
};

export default Page;