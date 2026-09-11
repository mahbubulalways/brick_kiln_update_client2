interface CustomButtonProps {
  label: string;
  color: string;
  activeLabel: string;
  setActiveLabel: (label: string) => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  color,
  activeLabel,
  setActiveLabel,
}) => {
  const isActive = activeLabel === label;

  return (
    <button
      onClick={() => setActiveLabel(label)}
      className={`text-gray-200 px-2 py-2 lg:py-1.5 rounded-md font-medium transition-all duration-300 hover:opacity-90  cursor-pointer w-full lg:w-auto`}
      style={{
        backgroundColor: isActive ? "#EA580C" : color,
      }}
    >
      {label}
    </button>
  );
};

export default CustomButton;
