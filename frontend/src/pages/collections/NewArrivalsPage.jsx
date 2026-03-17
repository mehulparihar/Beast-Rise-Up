"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Search, Sparkles } from "lucide-react"
import Navbar from '../../components/layout/Navbar'
import { Footer } from "../../components/layout/Footer"
import { ProductGridCard } from "@/components/shop/product-grid-card"
import { CollectionHeader } from "@/components/shop/collection-header"
import { ProductFilters } from "@/components/shop/product-filters"
import { FiltersSidebar } from "@/components/shop/filters-sidebar"
import { getNewArrivals, priceRanges } from "@/lib/products-data"


const NewArrivalsPage = () => {
  const [selectedType, setSelectedType] = useState("All")
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0])
  const [selectedSort, setSelectedSort] = useState({ label: "Newest", value: "newest" })
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [gridCols, setGridCols] = useState(3)

  const products = useMemo(() => getNewArrivals(), [])

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
        default:
          return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
      }
    })
  }, [filteredProducts, selectedSort])

  const hasActiveFilters = selectedType !== "All" || selectedPriceRange.label !== "All Prices"

  const clearFilters = () => {
    setSelectedType("All")
    setSelectedPriceRange(priceRanges[0])
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navbar/>

      <CollectionHeader
        title="New Arrivals"
        description="Fresh drops straight from the design lab. Be the first to rock the newest Beast Rise Up pieces."
        breadcrumb="New Arrivals"
        image="/new-fashion-arrivals-streetwear-dark-aesthetic-spa.jpg"
        productCount={sortedProducts.length}
      />

      {/* New Arrivals Info Bar */}
      <section className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-6 overflow-x-auto">
            <div className="flex items-center gap-2 text-sm whitespace-nowrap">
              <Sparkles size={16} className="text-accent" />
              <span className="text-muted-foreground">New drops every week</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-4 text-sm whitespace-nowrap">
              <span className="font-semibold text-foreground">Latest Drop:</span>
              <span className="text-muted-foreground">January 2025 Collection</span>
            </div>
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
                    <ProductGridCard key={product.id} product={product} viewMode="grid" />
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

export default NewArrivalsPage