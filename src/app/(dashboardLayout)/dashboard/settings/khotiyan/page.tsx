import Khotiyan from '@/components/Pages/SettingsPage/Khotiyan'
import CustomLoader from '@/components/Reusable/CustomLoader'
import { Suspense } from 'react'


export default function page() {
  return (
    <Suspense
        fallback={<div><CustomLoader cls="h-[30vh]"/></div>}
       >
         <Khotiyan />
       </Suspense>
  )
}
