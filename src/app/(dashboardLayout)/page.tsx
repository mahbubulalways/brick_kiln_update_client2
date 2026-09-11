import ShowMobileNavbar from "@/components/Dashboard/Layout/ShowMobileNavbar";
import DashboardPage from "@/components/Pages/DashboardRootPage/DashboardPage";

const Page = async () => {
  return (
    <div>
      <div className="hidden lg:block">
        <DashboardPage />
      </div>
      <div className="lg:hidden block">
        <ShowMobileNavbar />
      </div>
    </div>
  );
};

export default Page;
