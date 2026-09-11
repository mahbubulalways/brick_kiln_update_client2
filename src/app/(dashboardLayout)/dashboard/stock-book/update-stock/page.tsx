import UpdateStockBookPage from "@/components/Pages/StockBookPage/UpdateStockBookPage/UpdateStockBookPage";
import PrivateComponent from "@/components/Reusable/PrivateComponent";
import { TQuerySearch } from "@/interface/query";
import { modifyQuery } from "@/utils/modifyQuery";
export default async function page({ searchParams }: TQuerySearch) {
  const query = await searchParams
  const { currentLimit, currentPage } = modifyQuery(query)
  return (
    <PrivateComponent feature="STOCK">
      <UpdateStockBookPage
        limit={currentLimit}
        page={currentPage}
      />
    </PrivateComponent >
  )
}
