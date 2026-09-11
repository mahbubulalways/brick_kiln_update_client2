import TaskManagerPage from "@/components/Pages/TaskManagerPage/TaskManagerPage";
import PrivateComponent from "@/components/Reusable/PrivateComponent";

const Page = () => {
  return (
    <PrivateComponent feature="TASK_MANAGER">
      <TaskManagerPage />
    </PrivateComponent>
  );
};

export default Page;
