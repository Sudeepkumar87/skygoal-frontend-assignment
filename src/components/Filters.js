"use client"
import React, { useMemo, useState } from 'react'

export default function Filters({products, filters, setFilters}){
  const categories = useMemo(()=>[...new Set(products.map(p=>p.category))], [products])
  const brands = useMemo(()=>[...new Set(products.map(p=>p.brand))], [products])
  const colors = useMemo(()=>[...new Set(products.map(p=>p.color).filter(Boolean))], [products])
  const [priceRange, setPriceRange] = useState([0, 300])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [productStatus, setProductStatus] = useState({ inStock: false, onSale: false })

  const handleCategoryToggle = (category) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category]
    setSelectedCategories(newCategories)
    setFilters(f => ({ ...f, category: newCategories.length > 0 ? newCategories[0] : '' }))
  }

  const handleColorToggle = (color) => {
    const newColor = selectedColor === color ? '' : color
    setSelectedColor(newColor)
    setFilters(f => ({ ...f, color: newColor }))
  }

  const handleBrandToggle = (brand) => {
    const newBrand = selectedBrand === brand ? '' : brand
    setSelectedBrand(newBrand)
    setFilters(f => ({ ...f, brand: newBrand }))
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
      {/* Widget Price */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Widget price</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => {
                const newRange = [Number(e.target.value), priceRange[1]]
                setPriceRange(newRange)
                setFilters(f => ({ ...f, minPrice: newRange[0], maxPrice: newRange[1] }))
              }}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Min"
            />
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => {
                const newRange = [priceRange[0], Number(e.target.value)]
                setPriceRange(newRange)
                setFilters(f => ({ ...f, minPrice: newRange[0], maxPrice: newRange[1] }))
              }}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Max"
            />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            ${priceRange[0]} - ${priceRange[1]}
          </div>
        </div>
      </div>

      {/* Product Categories */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Product Categories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filter by Color */}
      {colors.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Filter by Color</h3>
          <div className="space-y-2">
            {colors.map(color => (
              <label key={color} className="flex items-center">
                <input
                  type="radio"
                  name="color"
                  checked={selectedColor === color}
                  onChange={() => handleColorToggle(color)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{color}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Filter by Brand */}
      {brands.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Filter by Brand</h3>
          <div className="space-y-2">
            {brands.map(brand => (
              <label key={brand} className="flex items-center">
                <input
                  type="radio"
                  name="brand"
                  checked={selectedBrand === brand}
                  onChange={() => handleBrandToggle(brand)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Product Status */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Product Status</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={productStatus.inStock}
              onChange={(e) => {
                setProductStatus({ ...productStatus, inStock: e.target.checked })
                setFilters(f => ({ ...f, status: e.target.checked ? 'In Stock' : '' }))
              }}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">In Stock</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={productStatus.onSale}
              onChange={(e) => setProductStatus({ ...productStatus, onSale: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">On Sale</span>
          </label>
        </div>
      </div>
    </div>
  )
}

