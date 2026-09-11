import Link from "next/link";

type TCalculate = {
  totalSell: number,
  cashSell: number,
  dueSell: number,
  payment: number,
  cash: number,
  due: number

}
const CalculationsCard = ({ cashSell, dueSell, totalSell, payment,cash,due }: TCalculate) => {
  const cards = [
    {
      title: "মোট বিক্রি (ভ্যাট সহ)",
      amount: `৳${totalSell ?? "00"}`,
      color: "bg-[#007bcd]",
      path: "/dashboard/invoice",
    },
    { title: "নগদ বিক্রি", amount: `৳${cashSell ?? "00"}`, color: "bg-[#159947]", path: "/" },
    { title: "বাকি বিক্রি", amount: `৳${dueSell ?? "00"}`, color: "bg-[#c43bda]", path: "/" },
    { title: "মোট পেমেন্ট", amount: `৳${payment ?? "00"}`, color: "bg-[#f26b1a]", path: "/" },
    { title: "বাকি জমা", amount:  `৳${due ?? "00"}`, color: "bg-[#10a98b]", path: "/" },
    { title: "মোট ক্যাশ", amount:  `৳${cash ?? "00"}`, color: "bg-[#6463e0]", path: "/" },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-1 pt-3">
      {cards.map((card, index) => (
        <Link
          href={card.path}
          key={index}
          className={`${card.color} text-white rounded-md p-4 flex flex-col justify-center items-start shadow-md w-full`}
        >
          <p className="font-medium text-[15px]">{card.title}</p>
          <p className="text-2xl font-semibold">{card.amount}</p>
        </Link>
      ))}
    </div>
  );
};

export default CalculationsCard;
