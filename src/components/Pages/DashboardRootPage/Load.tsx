import CardContainer from "./CardContainer";

export default function Load() {
  return (
    <CardContainer
      title="লোড"
      color="bg-[#14B8A6]"
      bg="bg-gradient-to-b from-[#14B8A6] to-[#99F6E4]"
    >
      <table className="w-full text-center border-collapse">
        <thead className="bg-[#99F6E4]">
          <tr>
            <th className="px-2 py-1 text-[#148679]   font-normal text-start">
              বিবরণ
            </th>
            <th className="px-2 py-1 text-[#148679]   font-normal text-end">
              পরিমান
            </th>
          </tr>
        </thead>
        <tbody>
          {/* #818CF8 */}
          <tr className="bg-[#F4FDFB]">
            <td className="text-[#14B8A6]  p-1.5 pl-2 text-start">
              ইট থেকে লোড হয়েছে
            </td>
            <td className="text-[#14B8A6] p-1.5 pl-r text-end">1,000</td>
          </tr>
          <tr className=" bg-[#F0FDFA]">
            <td className="text-[#14B8A6]  p-1.5 pl-2 text-start">মোট লোড</td>
            <td className="text-[#14B8A6] p-1.5 pl-r text-end">1,000</td>
          </tr>
        </tbody>
      </table>
    </CardContainer>
  );
}
