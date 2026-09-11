import { ReactNode } from "react";

type TCardContainer = {
  title: string;
  color: string;
  bg: string;
  children: ReactNode;
};

export default function CardContainer({
  title,
  color,
  children,
  bg,
}: TCardContainer) {
  return (
    <div className={`rounded-t-md  overflow-hidden`}>
      <div
        className={`${color} text-white py-1 rounded-t-md text-center  font-medium`}
      >
        {title}
      </div>
      <div className={`${bg} text-gray-800 pb-2`}>{children}</div>
    </div>
  );
}
