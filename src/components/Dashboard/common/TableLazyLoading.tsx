"use client";

interface TableLazyLoadingProps {
    smallColumns: number;
    largeColumns: number;
    rows?: number;
}

const TableLazyLoading = ({
    smallColumns,
    largeColumns,
    rows = 5,
}: TableLazyLoadingProps) => {
    const hiddenColumns = largeColumns - smallColumns;

    return (
        <>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr
                    key={rowIndex}
                    className="border-b border-gray-100"
                >
                    {Array.from({ length: largeColumns }).map(
                        (_, colIndex) => {
                            const isHidden =
                                colIndex >= smallColumns &&
                                colIndex <
                                smallColumns + hiddenColumns;

                            return (
                                <td
                                    key={colIndex}
                                    className={`h-14 px-4 ${isHidden
                                            ? "hidden lg:table-cell"
                                            : ""
                                        }`}
                                >
                                    <div className="mx-auto h-4 w-2/3 animate-pulse rounded-md bg-gray-200" />
                                </td>
                            );
                        },
                    )}
                </tr>
            ))}
        </>
    );
};

export default TableLazyLoading;