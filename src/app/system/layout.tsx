import PlatFormLayout from '@/components/Platform/PlatformLayout/PlatFormLayout'
import { ReactNode } from 'react'

export default function layout({children}:{children:ReactNode}) {
  return (
    <PlatFormLayout>{children}</PlatFormLayout>
  )
}
