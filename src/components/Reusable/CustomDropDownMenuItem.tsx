import { IconType } from "react-icons";

type TItem = {
  Icon: IconType;
  title: string;
};

const CustomDropDownMenuItem = ({ Icon, title }: TItem) => {
  return (
    <span className="flex items-center gap-2 text-[14px] cursor-pointer hover:bg-gray-100">
      <Icon className="w-4 h-4 text-gray-600" /> {title}
    </span>
  );
};

export default CustomDropDownMenuItem;
