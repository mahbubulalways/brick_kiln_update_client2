import AllDueListPage from "@/components/Pages/DuePage/AllDueListPage/AllDueListPage";
import PrivateComponent from "@/components/Reusable/PrivateComponent";
import { TQuerySearch } from "@/interface/query";
import { modifyQuery } from "@/utils/modifyQuery";

const AllDueList = async ({ searchParams }: TQuerySearch) => {
  const query = await searchParams
  const { currentLimit, currentPage, currentSearch } = modifyQuery(query)
  return (
    <PrivateComponent feature="DUE">
      <AllDueListPage  limit={currentLimit} page={currentPage} search={currentSearch} />
    </PrivateComponent>
  );
};

export default AllDueList;
