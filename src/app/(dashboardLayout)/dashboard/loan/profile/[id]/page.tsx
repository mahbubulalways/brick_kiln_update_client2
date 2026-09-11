import SingleReceivableAndPayablePage from '@/components/Pages/ReceivableAndPayablePage/SingleReceivableAndPayable/SingleReceivableAndPayablePage'
import PrivateComponent from '@/components/Reusable/PrivateComponent'
import { TParams } from '@/interface/query'


export default async function page(props: TParams) {
  const { id } = await props.params
  return (
    <PrivateComponent feature='LOAN'>
      <SingleReceivableAndPayablePage id={id} />
    </PrivateComponent>
  )
}
