import { IconType } from "react-icons";

interface CustomButtonFixedProps {
  title: string;
  Icon?: IconType;
  cls?: string;
}

const CustomButtonFixed = ({
  title,
  Icon,
  cls = "bg-[#039A63] text-white hover:bg-[#028a58] ",
}: CustomButtonFixedProps) => {
  return (
    <span
      className={`${cls} px-4 py-2 rounded   font-medium transition flex items-center justify-center gap-2 cursor-pointer w-max`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{title}</span>
    </span>
  );
};

export default CustomButtonFixed;
