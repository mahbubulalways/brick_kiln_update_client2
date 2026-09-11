import loader from "@/assets/loader.gif";
import Image from "next/image";
const CustomLoader = ({ cls }: { cls: string }) => {
  return (
    <div className={`flex flex-col justify-center items-center ${cls}`}>
      <Image src={loader} alt="loading" className="w-10" />
    </div>
  );
};

export default CustomLoader;
