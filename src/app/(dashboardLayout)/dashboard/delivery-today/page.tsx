import TodayHaveToDelivery from "@/components/Pages/Delivery/TodayHaveToDelivery/TodayHaveToDelivery";
import PrivateComponent from "@/components/Reusable/PrivateComponent";
import { TQuerySearch } from "@/interface/query";
import { modifyQuery } from "@/utils/modifyQuery";

const page = async({searchParams}:TQuerySearch) => {
  const query = await searchParams
  const {currentLimit,currentPage,currentSearch}=modifyQuery(query)
  return (
    <PrivateComponent feature="DELIVERY">
      <TodayHaveToDelivery limit={currentLimit} page={currentPage} search={currentSearch}/>
    </PrivateComponent>
  );
};

export default page;
