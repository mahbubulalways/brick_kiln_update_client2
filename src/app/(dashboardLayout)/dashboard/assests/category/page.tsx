import AssetsCategoryPage from '@/components/Pages/AssetsPage/AssetsCategoryPage/AssetsCategoryPage'
import PrivateComponent from '@/components/Reusable/PrivateComponent'
import React from 'react'

export default function page() {
  return (
    <PrivateComponent feature='ASSETS'><AssetsCategoryPage/></PrivateComponent>
  )
}
