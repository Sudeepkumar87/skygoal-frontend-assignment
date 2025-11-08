'use client'
import React, { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addProduct } from '../../redux/productsSlice'
import { v4 as uuidv4 } from 'uuid'
import { sanitizeInput } from '../../sanitize'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '../../components/DashboardLayout'
import { toast } from 'react-toastify'


export default function AddProduct(){
  const { register, handleSubmit, setError, formState:{errors} } = useForm()
  const dispatch = useDispatch()
  const products = useSelector(s=>s.products.items)
  const router = useRouter()
  const [images, setImages] = useState(['', '', '', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [brandType, setBrandType] = useState('select') // 'select' or 'custom'
    
  
  // Get unique brands from existing products
  const existingBrands = useMemo(() => {
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))]
    return brands.sort()
  }, [products])

  const handleImageChange = (index, value) => {
    const newImages = [...images]
    newImages[index] = value
    setImages(newImages)
  }

  // Validate name: alphabets/numbers only
  const validateName = (value) => {
    if (!value) return 'Product name is required'
    const nameRegex = /^[a-zA-Z0-9\s]+$/
    if (!nameRegex.test(value)) {
      return 'Name can only contain alphabets, numbers, and spaces'
    }
    return true
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    try {
      // Validate SKU uniqueness
      const exists = products.some(p => p.sku.toLowerCase() === data.sku.toLowerCase())
      if (exists) {
        setError('sku', { type: 'manual', message: 'SKU must be unique' })
        setIsSubmitting(false)
        return
      }

      // Validate price (positive number)
      if (Number(data.price) <= 0) {
        setError('price', { type: 'manual', message: 'Price must be a positive number' })
        setIsSubmitting(false)
        return
      }

      // Validate quantity (positive integer)
      const quantity = Number(data.quantity)
      if (quantity < 0 || !Number.isInteger(quantity)) {
        setError('quantity', { type: 'manual', message: 'Quantity must be a positive integer' })
        setIsSubmitting(false)
        return
      }

      // Get brand value
      const brand = brandType === 'custom' ? data.brandCustom : data.brand
      if (!brand || brand.trim() === '') {
        if (brandType === 'custom') {
          setError('brandCustom', { type: 'manual', message: 'Brand name is required' })
        } else {
          setError('brand', { type: 'manual', message: 'Brand is required' })
        }
        setIsSubmitting(false)
        return
      }

      // Create product object
      const sanitized = {
        id: 'p-' + uuidv4().slice(0, 8),
        name: sanitizeInput(data.name),
        price: Number(data.price),
        inStock: data.inStock === true || data.inStock === 'true' || data.status === 'Available',
        category: data.category,
        brand: sanitizeInput(brand),
        status: data.status,
        quantity: quantity,
        color: sanitizeInput(data.color || '#000000'),
        size: sanitizeInput(data.size || ''),
        sku: sanitizeInput(data.sku),
        rating: 0,
        image: images[0] || `https://via.placeholder.com/320x200?text=${encodeURIComponent(sanitizeInput(data.name))}`,
        images: images.filter(img => img.trim())
      }

      // Dispatch action to add product
      dispatch(addProduct(sanitized))
      
      toast.success('Product added successfully!')
      
      // Redirect to products page
      setTimeout(() => {
        router.push('/product')
      }, 500)
    } catch (error) {
      toast.error('Failed to add product. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 mb-6 transition-colors group"
          aria-label="Go back"
        >
          <svg 
            className="w-5 h-5 mr-2 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300 transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Back to Products</span>
        </button>

     

        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-8">Add New Product</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          {/* Product Information Section */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">Product Information</h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
              Fill in the product details below. All fields marked with <span className="text-red-500">*</span> are required.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SKU (Unique Identifier) <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('sku', {
                    required: 'SKU is required',
                    validate: (value) => {
                      const exists = products.some(p => p.sku.toLowerCase() === value.toLowerCase())
                      return !exists || 'SKU must be unique'
                    }
                  })}
                  placeholder="e.g., PROD-001"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {errors.sku && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.sku.message}</p>}
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name', {
                    required: 'Product name is required',
                    validate: validateName
                  })}
                  placeholder="Input product name (alphabets and numbers only)"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {errors.name && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>

              {/* Product Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select product category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Furniture">Furniture</option>
                </select>
                {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category.message}</p>}
              </div>

              {/* Brand Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="brandType"
                        value="select"
                        checked={brandType === 'select'}
                        onChange={(e) => setBrandType(e.target.value)}
                        className="w-4 h-4 text-blue-600 dark:bg-gray-700"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Select from list</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="brandType"
                        value="custom"
                        checked={brandType === 'custom'}
                        onChange={(e) => setBrandType(e.target.value)}
                        className="w-4 h-4 text-blue-600 dark:bg-gray-700"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enter custom</span>
                    </label>
                  </div>
                  {brandType === 'select' ? (
                    <select
                      {...register('brand', { required: brandType === 'select' ? 'Brand is required' : false })}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select brand</option>
                      {existingBrands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      {...register('brandCustom', { required: brandType === 'custom' ? 'Brand name is required' : false })}
                      placeholder="Enter brand name"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  )}
                </div>
                {errors.brand && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.brand.message}</p>}
                {errors.brandCustom && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.brandCustom.message}</p>}
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <input
                  {...register('size')}
                  placeholder="e.g., S, M, L, XL"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input
                  type="text"
                  {...register('color')}
                  placeholder="Color name or hex code (e.g., Red, #FF0000)"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('price', {
                    required: 'Price is required',
                    min: { value: 0.01, message: 'Price must be positive' }
                  })}
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {errors.price && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.price.message}</p>}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('quantity', {
                    required: 'Quantity is required',
                    min: { value: 0, message: 'Quantity must be 0 or positive' },
                    valueAsNumber: true
                  })}
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {errors.quantity && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.quantity.message}</p>}
              </div>

              {/* In-Stock Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  In-Stock <span className="text-red-500">*</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('inStock')}
                    className="w-5 h-5 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Product is in stock</span>
                </label>
              </div>

              {/* Status Product */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Status <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('status', { required: 'Status is required' })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select status product</option>
                  <option value="Available">Available</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Coming Soon">Coming Soon</option>
                </select>
                {errors.status && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.status.message}</p>}
              </div>
            </div>
          </div>

          {/* Image Product Section */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">Image Product</h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4">
              Note: Format photos SVG, PNG, or JPG (Max size 4mb).
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[150px] hover:border-blue-400 dark:hover:border-blue-300 transition-colors">
                  {images[index] ? (
                    <div className="relative w-full h-full">
                      <img src={images[index]} alt={`Photo ${index + 1}`} className="w-full h-24 sm:h-32 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => handleImageChange(index, '')}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-2xl sm:text-3xl mb-2">📷</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Photo {index + 1}</p>
                    </>
                  )}
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={images[index]}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className="mt-2 w-full text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 border-t">
            <Link
              href="/product"
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center text-sm sm:text-base"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                'Save Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}