import SmsPaymentRequest from '@/components/Platform/PlatformPages/SmsPage/SmsPaymentRequest/SmsPaymentRequest'
import { TQuerySearch } from '@/interface/query'
import { modifyQuery } from '@/utils/modifyQuery'

export default async function page({ searchParams }: TQuerySearch) {
    const query = await searchParams
    const { currentLimit, currentPage } = modifyQuery(query)
    return (
        <div>
            <SmsPaymentRequest
                limit={currentLimit}
                page={currentPage}
            />
        </div>
    )
}
