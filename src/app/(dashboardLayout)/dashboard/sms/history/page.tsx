
import { SmsPurchaseHistory } from '@/components/Pages/SmsPage/SmsPurchaseHistory'
import { TQuerySearch } from '@/interface/query'
import { modifyQuery } from '@/utils/modifyQuery'


export default async function page({ searchParams }: TQuerySearch) {
    const query = await searchParams
    const { currentLimit, currentPage } = modifyQuery(query)
    return (
        <div>
            <SmsPurchaseHistory
                limit={currentLimit}
                page={currentPage}
            />
        </div>
    )
}
