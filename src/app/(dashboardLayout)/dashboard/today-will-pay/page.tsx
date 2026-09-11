import TodayWillPayPage from "@/components/Pages/DuePage/TodayWillPayPage/TodayWillPayPage";
import PrivateComponent from "@/components/Reusable/PrivateComponent";
import { TQuerySearch } from "@/interface/query";
import { modifyQuery } from "@/utils/modifyQuery";

const TodayWillPay = async ({ searchParams }: TQuerySearch) => {
  const query = await searchParams
  const { currentLimit, currentPage, currentSearch } = modifyQuery(query)

  return (
    <PrivateComponent feature="DUE">
      <TodayWillPayPage  limit={currentLimit} page={currentPage} search={currentSearch}/>
    </PrivateComponent>
  );
};

export default TodayWillPay;
