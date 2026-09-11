import ChangeClassAndRate from '@/components/Pages/SettingsPage/ChangeClassAndRate'
import CustomLoader from '@/components/Reusable/CustomLoader'
import { Suspense } from 'react'


export default function page() {
  return (

    <Suspense
      fallback={<div><CustomLoader cls="h-[30vh]" /></div>}
    >
      <ChangeClassAndRate />
    </Suspense>
  )
}
