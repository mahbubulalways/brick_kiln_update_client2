type TTableData = {
  td: string | number;
  cls?: string;
  rowSpan?: number;
};
const TableData = ({ td, cls, rowSpan }: TTableData) => {
  return (
    <td
      rowSpan={rowSpan}
      className={`border p-1 lg:p-2 text-center whitespace-nowrap text-sm lg:text-[14px] ${
        cls || ""
      }`}
    >
      {td}
    </td>
  );
};

export default TableData;
