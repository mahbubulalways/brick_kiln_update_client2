import SellReportPage from "@/components/Pages/SellReportPage/SellReportPage";
import PrivateComponent from "@/components/Reusable/PrivateComponent";

const Page = () => {
  return (
    <PrivateComponent feature="SELL_REPORT">
      <SellReportPage />
    </PrivateComponent>
  );
};

export default Page;
