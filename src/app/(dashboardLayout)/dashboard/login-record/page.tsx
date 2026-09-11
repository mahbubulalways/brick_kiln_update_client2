import LoginRecordPage from "@/components/Pages/LoginRecordPage/LoginRecordPage";
import { TQuerySearch } from "@/interface/query";
import { modifyQuery } from "@/utils/modifyQuery";

const Page = async ({ searchParams }: TQuerySearch) => {
  const query = await searchParams
  const { currentLimit, currentPage } = modifyQuery(query)
  return (
    <div>
      <LoginRecordPage limit={currentLimit} page={currentPage}/>
    </div>
  );
};

export default Page;
