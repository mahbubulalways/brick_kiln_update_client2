import LoadPage from "@/components/Pages/LoadPage/LoadPage";
import PrivateComponent from "@/components/Reusable/PrivateComponent";
import { TQuerySearch } from "@/interface/query";
import { modifyQuery } from "@/utils/modifyQuery";

const Load = async ({ searchParams }: TQuerySearch) => {
  const query = await searchParams
  const { currentLimit, currentPage, currentSearch } = modifyQuery(query)
  return (
    <PrivateComponent feature="LOAD">
      <LoadPage limit={currentLimit} page={currentPage} search={currentSearch}/>
    </PrivateComponent>
  );
};

export default Load;
