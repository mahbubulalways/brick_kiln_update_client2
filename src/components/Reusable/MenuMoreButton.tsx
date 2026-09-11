import { MoreVertical } from "lucide-react";

const MenuMoreButton = () => {
  return (
    <span className="p-1.5 rounded hover:bg-gray-100 transition">
      <MoreVertical className="w-4 h-4 text-gray-600 cursor-pointer" />
    </span>
  );
};

export default MenuMoreButton;
