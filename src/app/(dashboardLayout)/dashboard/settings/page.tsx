import DashboardSettings from "@/components/Pages/SettingsPage/DashboardSettings";
import { TQuerySearch } from "@/interface/query";
import { modifyQuery } from "@/utils/modifyQuery";

const page = async ({ searchParams }: TQuerySearch) => {
  const query = await searchParams
  const { currentLimit, currentPage, currentSearch } = modifyQuery(query)
  return (
    <div>
      <DashboardSettings limit={currentLimit} page={currentPage} search={currentSearch} />
    </div>
  );
};

export default page;
