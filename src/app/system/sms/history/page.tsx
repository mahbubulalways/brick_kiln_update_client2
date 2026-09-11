import SmsPurchasedHistoryPage from '@/components/Platform/PlatformPages/SmsPage/SmsPurchasedHistoryPage/SmsPurchasedHistoryPage'
import { TQuerySearch } from '@/interface/query'
import { modifyQuery } from '@/utils/modifyQuery'


export default async function page({ searchParams }: TQuerySearch) {
    const query = await searchParams
    const { currentLimit, currentPage } = modifyQuery(query)
    return (
        <div>
            <SmsPurchasedHistoryPage
                limit={currentLimit}
                page={currentPage}
            />
        </div>
    )
}
