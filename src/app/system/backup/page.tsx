import DatabaseBackupPage from '@/components/Platform/PlatformPages/DatabaseBackupPage/DatabaseBackupPage'
import { TQuerySearch } from '@/interface/query'
import { modifyQuery } from '@/utils/modifyQuery'

export default async function page({ searchParams }: TQuerySearch) {
    const query = await searchParams
    const { currentLimit, currentPage } = modifyQuery(query)
    return (
        <div>
            <DatabaseBackupPage
                limit={currentLimit}
                page={currentPage}
            />
        </div>
    )
}
