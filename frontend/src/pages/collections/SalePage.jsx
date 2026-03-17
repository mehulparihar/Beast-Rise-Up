"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Search, Percent, Clock } from "lucide-react"
import Navbar from '../../components/layout/Navbar'
import { Footer } from "../../components/layout/Footer"
import { ProductGridCard } from "@/components/shop/product-grid-card"
import { CollectionHeader } from "@/components/shop/collection-header"
import { ProductFilters } from "@/components/shop/product-filters"
import { FiltersSidebar } from "@/components/shop/filters-sidebar"
import { getSaleProducts, priceRanges, sortOptions } from "@/lib/products-data"

const SalePage = () => {
  const [selectedType, setSelectedType] = useState("All")
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0])
  const [selectedSort, setSelectedSort] = useState(sortOptions[0])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [gridCols, setGridCols] = useState(3)

  const products = useMemo(() => getSaleProducts(), [])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedType !== "All" && product.type !== selectedType) return false
      if (product.price < selectedPriceRange.min || product.price > selectedPriceRange.max) return false
      return true
    })
  }, [products, selectedType, selectedPriceRange])

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (selectedSort.value) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "bestselling":
          return b.reviews - a.reviews
        case "newest":
          return b.id - a.id
        default:
          // Sort by discount percentage
          const discountA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0
          const discountB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0
          return discountB - discountA
      }
    })
  }, [filteredProducts, selectedSort])

  const hasActiveFilters = selectedType !== "All" || selectedPriceRange.label !== "All Prices"

  const clearFilters = () => {
    setSelectedType("All")
    setSelectedPriceRange(priceRanges[0])
  }

  // Calculate total savings
  const totalSavings = products.reduce((acc, product) => {
    if (product.originalPrice) {
      return acc + (product.originalPrice - product.price)
    }
    return acc
  }, 0)

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />

      <CollectionHeader
        title="Sale"
        description="Premium quality at unbeatable prices. Grab these deals before they're gone forever."
        breadcrumb="Sale"
        image="/sale-discount-shopping-dark-aesthetic-red.jpg"
        productCount={sortedProducts.length}
      />

      {/* Sale Stats Bar */}
      <section className="bg-accent text-accent-foreground">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                <Percent size={16} />
                <span className="font-semibold">Up to 30% OFF</span>
              </div>
              <div className="h-4 w-px bg-accent-foreground/30" />
              <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                <Clock size={16} />
                <span>Limited Time Only</span>
              </div>
            </div>
            <div className="text-sm font-semibold">Save up to ${totalSavings.toFixed(2)} on this collection!</div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <FiltersSidebar
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedPriceRange={selectedPriceRange}
            setSelectedPriceRange={setSelectedPriceRange}
            hasActiveFilters={hasActiveFilters}
            clearFilters={clearFilters}
          />

          <div className="flex-1">
            <ProductFilters
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedPriceRange={selectedPriceRange}
              setSelectedPriceRange={setSelectedPriceRange}
              selectedSort={selectedSort}
              setSelectedSort={setSelectedSort}
              viewMode={viewMode}
              setViewMode={setViewMode}
              gridCols={gridCols}
              setGridCols={setGridCols}
              productCount={sortedProducts.length}
              hasActiveFilters={hasActiveFilters}
              clearFilters={clearFilters}
            />

            {sortedProducts.length > 0 ? (
              viewMode === "grid" ? (
                <div className={`grid gap-4 md:gap-6 ${gridCols === 2 ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3"}`}>
                  {sortedProducts.map((product) => (
                    <div key={product.id} className="relative">
                      {product.originalPrice && (
                        <div className="absolute -top-2 -right-2 z-20 px-2 py-1 bg-accent text-accent-foreground rounded-full text-xs font-bold">
                          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </div>
                      )}
                      <ProductGridCard product={product} viewMode="grid" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedProducts.map((product) => (
                    <ProductGridCard key={product.id} product={product} viewMode="list" />
                  ))}
                </div>
              )
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters</p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-semibold rounded-full hover:bg-foreground/90 transition-colors"
                >
                  Clear All Filters
                  <ArrowRight size={18} />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default SalePage