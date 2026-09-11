import CarRentPage from "@/components/Pages/CarRentPage/CarRentPage";
import PrivateComponent from "@/components/Reusable/PrivateComponent";
import { TQuerySearch } from "@/interface/query";
import { modifyQuery } from "@/utils/modifyQuery";

const Page = async ({ searchParams }: TQuerySearch) => {
  const query = await searchParams
  const {currentLimit,currentPage,currentSearch } = modifyQuery(query)
  return (
    <PrivateComponent feature="CAR_RENTAL">
      <CarRentPage limit={currentLimit} page={currentPage} search={currentSearch}/>
    </PrivateComponent>
  );
};

export default Page;
