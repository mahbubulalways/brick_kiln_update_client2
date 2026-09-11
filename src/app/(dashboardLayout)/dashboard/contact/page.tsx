import ContackPage from '@/components/Pages/ContactPage/ContackPage'
import PrivateComponent from '@/components/Reusable/PrivateComponent'
import { TQuerySearch } from '@/interface/query'
import { modifyQuery } from '@/utils/modifyQuery'


export default async function page({ searchParams }: TQuerySearch) {
    const query = await searchParams
    const { currentLimit, currentPage, currentSearch } = modifyQuery(query)
    return (
        <PrivateComponent feature='CONTACT'>
            <ContackPage
                limit={currentLimit}
                page={currentPage}
                search={currentSearch}
            />
        </PrivateComponent>
    )
}
