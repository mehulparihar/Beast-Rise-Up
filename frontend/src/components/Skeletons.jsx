export function ProductCardSkeleton() {
  return (
    <div className="bg-background rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-secondary" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-secondary rounded w-3/4" />
        <div className="h-3 bg-secondary rounded w-1/2" />
        <div className="flex items-center gap-2">
          <div className="h-5 bg-secondary rounded w-16" />
          <div className="h-4 bg-secondary rounded w-12" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="min-h-[90vh] bg-secondary animate-pulse flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="h-6 bg-muted rounded-full w-40" />
            <div className="space-y-3">
              <div className="h-12 bg-muted rounded w-full" />
              <div className="h-12 bg-muted rounded w-3/4" />
            </div>
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="flex gap-4 pt-4">
              <div className="h-14 bg-muted rounded-xl w-40" />
              <div className="h-14 bg-muted rounded-xl w-40" />
            </div>
          </div>
          <div className="aspect-square bg-muted rounded-3xl" />
        </div>
      </div>
    </div>
  )
}

export function CategorySkeleton() {
  return (
    <div className="aspect-[4/5] bg-secondary rounded-2xl animate-pulse relative overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="h-6 bg-muted rounded w-24 mb-2" />
        <div className="h-4 bg-muted rounded w-32" />
      </div>
    </div>
  )
}

export function CategoriesSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CategorySkeleton key={i} />
      ))}
    </div>
  )
}

export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 bg-secondary rounded-xl animate-pulse">
      <div className="w-24 h-24 bg-muted rounded-lg" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-5 bg-muted rounded w-20" />
      </div>
    </div>
  )
}

export function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-secondary animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-muted rounded-full" />
              <div className="h-4 bg-muted rounded w-16 hidden sm:block" />
              {i < 2 && <div className="w-12 h-0.5 bg-muted mx-2" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CartItemSkeleton key={i} />
            ))}
          </div>

          {/* Summary */}
          <div className="bg-background rounded-2xl p-6 h-fit space-y-4">
            <div className="h-6 bg-secondary rounded w-32" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-secondary rounded w-24" />
                  <div className="h-4 bg-secondary rounded w-16" />
                </div>
              ))}
            </div>
            <div className="h-12 bg-secondary rounded-xl w-full mt-4" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function NavbarSkeleton() {
  return (
    <div className="h-16 lg:h-20 bg-background border-b border-border animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-secondary rounded-lg" />
          <div className="h-5 bg-secondary rounded w-32 hidden sm:block" />
        </div>
        <div className="hidden lg:flex items-center gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 bg-secondary rounded w-16" />
          ))}
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-10 h-10 bg-secondary rounded-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function TestimonialSkeleton() {
  return (
    <div className="bg-secondary rounded-2xl p-6 animate-pulse">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-4 h-4 bg-muted rounded" />
        ))}
      </div>
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-3/4" />
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-muted rounded-full" />
        <div className="space-y-1">
          <div className="h-4 bg-muted rounded w-24" />
          <div className="h-3 bg-muted rounded w-16" />
        </div>
      </div>
    </div>
  )
}

export function PolicyPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 animate-pulse">
      <div className="h-12 bg-secondary rounded w-64 mb-4" />
      <div className="h-4 bg-secondary rounded w-40 mb-12" />
      <div className="space-y-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-7 bg-secondary rounded w-48" />
            <div className="space-y-2">
              <div className="h-4 bg-secondary rounded w-full" />
              <div className="h-4 bg-secondary rounded w-full" />
              <div className="h-4 bg-secondary rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
