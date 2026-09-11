import CashPage from "@/components/Pages/CashPage/CashPage";
import PrivateComponent from "@/components/Reusable/PrivateComponent";
import { TQuerySearch } from "@/interface/query";
import { modifyQuery } from "@/utils/modifyQuery";

const Cash = async ({ searchParams }: TQuerySearch) => {
  const query = await searchParams
  const { currentLimit, currentPage, currentSearch } = modifyQuery(query)
  return (
    <PrivateComponent feature="CASH">
      <CashPage limit={currentLimit} page={currentPage} search={currentSearch} />
    </PrivateComponent>
  );
};

export default Cash;
