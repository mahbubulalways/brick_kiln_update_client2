import SingleVataPage from '@/components/Platform/PlatformPages/SingleVataPage/SingleVataPage'
import { TParams } from '@/interface/query'

export default async function page({ params }: TParams) {
    const { id } = await params
    return (
        <div>
            <SingleVataPage id={id} />
        </div>
    )
}
