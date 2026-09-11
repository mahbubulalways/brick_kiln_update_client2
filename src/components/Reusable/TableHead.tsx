type TTableHead = {
  th: string | number;
  cls?: string;
};
const TableHead = ({ th, cls }: TTableHead) => {
  return (
    <th className={`p-2 border text-nowrap text-sm font-medium lg:text-[15px] ${cls}`}>
      {th}
    </th>
  );
};

export default TableHead;
