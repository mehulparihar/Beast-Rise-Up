import React from 'react'
import { HeroSkeleton, NavbarSkeleton, ProductGridSkeleton } from '../components/Skeletons'

const Loading = () => {
  return (
    <>
      <NavbarSkeleton />
      <HeroSkeleton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="h-8 bg-secondary rounded w-48 mb-8 animate-pulse" />
        <ProductGridSkeleton count={8} />
      </div>
    </>
  )
}

export default Loading;