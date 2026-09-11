import { Suspense } from "react";
import StockBookPage from "@/components/Pages/StockBookPage/StockBookPage";
import CustomLoader from "@/components/Reusable/CustomLoader";
import PrivateComponent from "@/components/Reusable/PrivateComponent";

const Page = () => {
  return (
    <PrivateComponent feature="STOCK">
      <Suspense
        fallback={
          <CustomLoader cls="h-[30vh]" />
        }
      >
        <StockBookPage />
      </Suspense>
    </PrivateComponent>
  );
};

export default Page;