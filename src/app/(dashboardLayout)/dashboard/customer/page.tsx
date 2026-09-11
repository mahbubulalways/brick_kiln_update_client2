import CustomerPage from "@/components/Pages/CustomerPage/CustomerPage";
import PrivateComponent from "@/components/Reusable/PrivateComponent";
import { TQuerySearch } from "@/interface/query";
import { modifyQuery } from "@/utils/modifyQuery";

const Page = async ({ searchParams }: TQuerySearch) => {
  const query = await searchParams
  const {currentLimit,currentPage,currentSearch}= modifyQuery(query)
  return (
    <PrivateComponent feature="CUSTOMER">
      <CustomerPage limit={currentLimit} page={currentPage} search={currentSearch}/>
    </PrivateComponent>
  );
};

export default Page;
