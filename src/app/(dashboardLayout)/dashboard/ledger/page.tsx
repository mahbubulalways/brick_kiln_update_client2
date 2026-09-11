import LedgerPage from "@/components/Pages/LedgerPage/LedgerPage";
import PrivateComponent from "@/components/Reusable/PrivateComponent";


const Page = () => {
  return (
    <PrivateComponent feature="LEDGER">
      <LedgerPage />
    </PrivateComponent>
  );
};

export default Page;
