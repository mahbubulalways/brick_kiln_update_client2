import DueCollectionPage from "@/components/Pages/DuePage/DueCollectionPage/DueCollectionPage";
import PrivateComponent from "@/components/Reusable/PrivateComponent";
import { TQuerySearch } from "@/interface/query";
import { modifyQuery } from "@/utils/modifyQuery";

const DueCollection = async ({ searchParams }: TQuerySearch) => {
  const query = await searchParams
  const { currentLimit, currentPage, } = modifyQuery(query)
  return (
    <PrivateComponent feature="DUE">
      <DueCollectionPage limit={currentLimit} page={currentPage} />
    </PrivateComponent>
  );
};

export default DueCollection;
