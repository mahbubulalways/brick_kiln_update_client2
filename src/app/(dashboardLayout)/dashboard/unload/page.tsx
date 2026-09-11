import UnloadPage from "@/components/Pages/UnloadPage/UnloadPage";
import PrivateComponent from "@/components/Reusable/PrivateComponent";
import { TQuerySearch } from "@/interface/query";
import { modifyQuery } from "@/utils/modifyQuery";


const Unload = async({searchParams}:TQuerySearch) => {
  const query = await searchParams
  const {currentLimit,currentPage}=modifyQuery(query)
  return (
    <PrivateComponent feature="UNLOAD">
      <UnloadPage limit={currentLimit} page={currentPage}/>
    </PrivateComponent>
  );
};

export default Unload;
