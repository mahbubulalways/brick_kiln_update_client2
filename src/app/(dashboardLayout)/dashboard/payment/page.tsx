import PaymentPage from "@/components/Pages/PaymentPage/PaymentPage";
import PrivateComponent from "@/components/Reusable/PrivateComponent";
import { TQuerySearch } from "@/interface/query";
import { modifyQuery } from "@/utils/modifyQuery";

const Payment = async ({ searchParams }: TQuerySearch) => {
  const query = await searchParams;
  const { currentLimit, currentPage, currentSearch } = modifyQuery(query);
  return (
    <PrivateComponent feature="PAYMENT">
      <PaymentPage
        limit={currentLimit}
        search={currentSearch}
        page={currentPage}
      />
    </PrivateComponent>
  );
};

export default Payment;
