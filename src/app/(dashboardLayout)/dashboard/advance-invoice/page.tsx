import AdvanceInvoicePage from "@/components/Pages/Invoice/AdvanceInvoicePage/AdvanceInvoicePage";
import PrivateComponent from "@/components/Reusable/PrivateComponent";
import { TQuerySearch } from "@/interface/query";
import { modifyQuery } from "@/utils/modifyQuery";

const AdvanceInvoice = async ({ searchParams }: TQuerySearch) => {
  const query = await searchParams
  const { currentLimit, currentPage, currentSearch } = modifyQuery(query)
  return (
    <PrivateComponent feature="INVOICE">
      <AdvanceInvoicePage limit={currentLimit} page={currentPage} search={currentSearch} />
    </PrivateComponent>
  );
};

export default AdvanceInvoice;
