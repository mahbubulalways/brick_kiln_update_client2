import CardContainer from "./CardContainer";

export default function Unload() {
  return (
    <CardContainer
      title="আনলোড"
      color="bg-[#A8A29E]"
      bg="bg-gradient-to-b from-[#A8A29E] to-[#E7E5E4]"
    >
      <table className="w-full text-center border-collapse">
        <thead className="bg-[#E7E5E4]">
          <tr>
            <th className="px-2 py-1 text-[#6d6b69] font-normal text-start">
              শ্রেণি
            </th>
            <th className="px-2 py-1 text-[#6d6b69] font-normal text-end">
              পরিমান
            </th>
          </tr>
        </thead>
        <tbody>
          {/* #818CF8 */}
          <tr className="bg-[#F8F8F8]">
            <td className="text-[#6d6b69]  p-1.5 pl-2 text-start">১ নং</td>
            <td className="text-[#6d6b69] p-1.5 pl-r text-end">1,000</td>
          </tr>
          <tr className="bg-[#F8F8F8]">
            <td className="text-[#6d6b69]  p-1.5 pl-2 text-start">পিকেট</td>
            <td className="text-[#6d6b69] p-1.5 pl-r text-end">1,000</td>
          </tr>
          <tr className=" bg-[#F5F5F4]">
            <td className="text-[#6d6b69]  p-1.5 pl-2 text-start">মোট আনলোড</td>
            <td className="text-[#6d6b69] p-1.5 pl-r text-end">1,000</td>
          </tr>
        </tbody>
      </table>
    </CardContainer>
  );
}
