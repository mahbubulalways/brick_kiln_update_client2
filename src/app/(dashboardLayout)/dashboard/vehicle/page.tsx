import CarPage from "@/components/Pages/CarPage/CarPage";
import PrivateComponent from "@/components/Reusable/PrivateComponent";

const Page = () => {
  return (
    <PrivateComponent feature="VEHICLE">
      <CarPage />
    </PrivateComponent>
  );
};

export default Page;
