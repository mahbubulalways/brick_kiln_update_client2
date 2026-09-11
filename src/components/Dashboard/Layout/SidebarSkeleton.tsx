const SidebarSkeleton = () => {
  return (
    <div className="flex-1 overflow-hidden">
      <ul className="flex flex-col gap-1 mt-2 px-1.5">
        {Array.from({ length: 15 }).map((_, index) => (
          <li
            key={index}
            className="h-9 flex items-center gap-2 px-2 rounded"
          >
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />

            <div
              className="h-3 bg-gray-200 rounded animate-pulse"
              style={{
                width: `${50 + ((index * 17) % 45)}%`,
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarSkeleton;