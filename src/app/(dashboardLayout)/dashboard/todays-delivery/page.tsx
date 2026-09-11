import TodaysDeliveryPage from "@/components/Pages/Delivery/TodaysDelivery/TodaysDelivery";
import PrivateComponent from "@/components/Reusable/PrivateComponent";
import { TQuerySearch } from "@/interface/query";
import { modifyQuery } from "@/utils/modifyQuery";

const TodaysDelivery = async ({ searchParams }: TQuerySearch) => {
  const query = await searchParams
  const { currentLimit, currentPage } = modifyQuery(query)
  return (
    <PrivateComponent feature="DELIVERY">
      <TodaysDeliveryPage limit={currentLimit} page={currentPage} />
    </PrivateComponent>
  );
};

export default TodaysDelivery;
