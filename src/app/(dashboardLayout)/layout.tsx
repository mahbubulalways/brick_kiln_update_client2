import DashboardLayout from "@/components/Dashboard/Layout/DashboardLayout";
import { TChildren } from "@/types/project";
const SecureLayout = ({ children }: TChildren) => {
  return (
    <div>
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  );
};

export default SecureLayout;
