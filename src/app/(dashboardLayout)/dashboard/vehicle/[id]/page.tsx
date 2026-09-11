import SingleCarPage from '@/components/Pages/CarPage/SingleCarPage/SingleCarPage'
import PrivateComponent from '@/components/Reusable/PrivateComponent'
import { TParams } from '@/interface/query'

export default async function page(props: TParams) {
    const { id } = await props.params
    return (
        <PrivateComponent feature='VEHICLE'>
            <SingleCarPage id={id} />
        </PrivateComponent>
    )
}
