import Link from "next/link";
import { IconType } from "react-icons";

type TNavbarIcon = {
  title: string;
  Icon: IconType;
  path: string;
};

const NavbarIcon = ({ Icon, path, title }: TNavbarIcon) => {
  return (
    <Link href={path}>
      <button
        className="
                          group
                          cursor-pointer
                          flex items-center
                          gap-1
                          border-2 border-gray-300
                          overflow-hidden
                          transition-all duration-700
                          mx-auto
                          max-w-10 hover:max-w-[180px]
                          text-gray-600  
                          hover:bg-gray-200
                          px-2 py-1 rounded-md
                        "
      >
        {/* Icon */}
        <div className="shrink-0 flex justify-center items-center ">
          <Icon size={18} className="transition-transform duration-300 " />
        </div>

        {/* Text slides in from right */}
        <span
          className="
                              font-medium whitespace-nowrap
                            opacity-0 translate-x-5
                            transition-all duration-300
                            group-hover:opacity-100 group-hover:translate-x-0
                          "
        >
          {title}
        </span>
      </button>
    </Link>
  );
};

export default NavbarIcon;
