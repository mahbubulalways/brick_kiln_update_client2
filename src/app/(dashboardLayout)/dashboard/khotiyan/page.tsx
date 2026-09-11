import { Suspense } from "react";
import Khotiyan from "@/components/Pages/SettingsPage/Khotiyan";
import CustomLoader from "@/components/Reusable/CustomLoader";
import PrivateComponent from "@/components/Reusable/PrivateComponent";

export default function Page() {
  return (
    <PrivateComponent feature="LEDGER">
      <Suspense
        fallback={<div><CustomLoader cls="h-[30vh]" /></div>}
      >
        <Khotiyan />
      </Suspense>
    </PrivateComponent>
  );
} 