'use client'
import React, { useMemo, useState, useEffect, Suspense } from 'react'
import { useSelector } from 'react-redux'
import Filters from '../../components/Filters'
import ProductCard from '../../components/ProductCard'
import Pagination from '../../components/Pagination'
import ProductModal from '../../components/ProductModal'
import { useSearchParams } from 'next/navigation'

function ProductsContent() {
  const products = useSelector(s=>s.products.items)
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState({ 
    q:'', 
    category: '', 
    brand:'', 
    minPrice:'', 
    maxPrice:'', 
    status:'', 
    color: '',
    sort:'' 
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const category = searchParams?.get('category')
    if (category) {
      setFilters(f => ({ ...f, category }))
    }
  }, [searchParams])
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)
  const pageSize = 20

  const filtered = useMemo(()=>{
    let res = [...products]
    if(filters.q) res = res.filter(p=>p.name.toLowerCase().includes(filters.q.toLowerCase()))
    if(filters.category) res = res.filter(p=>p.category===filters.category)
    if(filters.brand) res = res.filter(p=>p.brand===filters.brand)
    if(filters.color) res = res.filter(p=>p.color===filters.color)
    if(filters.status) res = res.filter(p=>p.status===filters.status)
    if(filters.minPrice) res = res.filter(p=>p.price >= Number(filters.minPrice))
    if(filters.maxPrice) res = res.filter(p=>p.price <= Number(filters.maxPrice))
    if(filters.sort === 'rating_desc') res.sort((a,b)=>b.rating - a.rating)
    if(filters.sort === 'rating_asc') res.sort((a,b)=>a.rating - b.rating)
    if(filters.sort === 'price_asc') res.sort((a,b)=>a.price - b.price)
    if(filters.sort === 'price_desc') res.sort((a,b)=>b.price - a.price)
    return res
  },[products, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page-1)*pageSize, page*pageSize)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-6 sm:mb-8 mt-4 sm:mt-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Grocery store with different treasures
        </h1>
        <div className="relative h-48 sm:h-56 lg:h-64 rounded-lg overflow-hidden mb-4 sm:mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
            <p className="text-white text-lg sm:text-xl lg:text-2xl font-semibold px-4 text-center">
              Fresh Products Available
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium text-gray-700">Filters</span>
          <svg
            className={`h-5 w-5 text-gray-500 transform transition-transform ${showFilters ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Filters Sidebar */}
        <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="sticky top-20 lg:top-24">
            <Filters products={products} filters={filters} setFilters={setFilters} />
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Search and Sort */}
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={filters.q}
                onChange={(e) => setFilters(f => ({ ...f, q: e.target.value }))}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            <select
              value={filters.sort}
              onChange={(e) => setFilters(f => ({ ...f, sort: e.target.value }))}
              className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Sort by</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Rating: High to Low</option>
              <option value="rating_asc">Rating: Low to High</option>
            </select>
          </div>

          {/* Products Grid */}
          {pageItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {pageItems.map(p => (
                  <ProductCard key={p.id} p={p} onClick={setSelected} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} setPage={setPage} />
            </>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-base sm:text-lg">No products found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>

      <ProductModal product={selected} onClose={()=>setSelected(null)} />
    </div>
  )
}

export default function ProductsPage(){
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  )
}
