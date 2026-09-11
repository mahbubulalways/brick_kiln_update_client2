import AllDeliveryPage from "@/components/Pages/Delivery/AllDeliveries/AllDeliveryPage";
import PrivateComponent from "@/components/Reusable/PrivateComponent";
import { TQuerySearch } from "@/interface/query";
import { modifyQuery } from "@/utils/modifyQuery";

const AllDeliveries = async ({ searchParams }: TQuerySearch) => {
  const query = await searchParams
  const { currentLimit, currentPage, currentSearch } = modifyQuery(query)
  return (
    <PrivateComponent
      feature="DELIVERY"
    >
      <AllDeliveryPage
        limit={currentLimit}
        page={currentPage}
        search={currentSearch} />
    </PrivateComponent>
  );
};

export default AllDeliveries;
