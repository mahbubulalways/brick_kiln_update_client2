import DashboardPage from "@/components/Pages/DashboardRootPage/DashboardPage";
import PrivateComponent from "@/components/Reusable/PrivateComponent";

const Dashboard = () => {
  return (
    <PrivateComponent feature="DASHBOARD">
      <DashboardPage />
    </PrivateComponent>
  );
};

export default Dashboard;
