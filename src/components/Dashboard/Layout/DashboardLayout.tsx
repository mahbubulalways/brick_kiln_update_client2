import ComputerLayout from "./ComputerLayout";
import { TChildren } from "@/types/project";
import MobileLayout from "./MobileLayout";

const DashboardLayout = ({ children }: TChildren) => {
  return (
    <div>
      <div className="block lg:hidden">
        <MobileLayout>{children}</MobileLayout>
      </div>
      <div className="hidden lg:block">
        <ComputerLayout>{children}</ComputerLayout>
      </div>
    </div>
  );
};

export default DashboardLayout;
