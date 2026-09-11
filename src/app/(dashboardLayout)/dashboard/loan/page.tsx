import ReceivableAndPayablePage from "@/components/Pages/ReceivableAndPayablePage/ReceivableAndPayablePage";
import PrivateComponent from "@/components/Reusable/PrivateComponent";


const Page = () => {
  return (
    <PrivateComponent feature="LOAN">
      <ReceivableAndPayablePage />
    </PrivateComponent>
  );
};

export default Page;
