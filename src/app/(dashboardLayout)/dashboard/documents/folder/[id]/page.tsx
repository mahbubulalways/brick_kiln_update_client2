import SingleFolderPage from '@/components/Pages/Docuemts/SingleFolder/SingleFolderPage'
import PrivateComponent from '@/components/Reusable/PrivateComponent'
import { TParams } from '@/interface/query'
export default async function page(props: TParams) {
  const { id } = await props.params
  return (
    <PrivateComponent feature='DOCUMENTS'>
      <SingleFolderPage id={id} />
    </PrivateComponent>
  )
}
