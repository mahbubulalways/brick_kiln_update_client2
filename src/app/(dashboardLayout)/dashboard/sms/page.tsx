import SmsPage from '@/components/Pages/SmsPage/SmsPage'
import PrivateComponent from '@/components/Reusable/PrivateComponent'

export default function page() {
  return (
    <PrivateComponent feature='SMS'><SmsPage/></PrivateComponent>
  )
}
