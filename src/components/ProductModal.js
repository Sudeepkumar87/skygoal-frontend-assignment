"use client"
import React from 'react'

export default function ProductModal({product, onClose}){
  if(!product) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b flex-shrink-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 pr-4">{product.name}</h3>
          <button 
            onClick={onClose} 
            className="px-3 py-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="w-full">
              <img src={product.image} alt={product.name} className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-lg"/>
            </div>
            <div className="space-y-3 sm:space-y-4 h-80 overflow-y-auto">
              <div>
                <span className="text-sm font-semibold text-gray-500">Brand:</span>
                <p className="text-base sm:text-lg font-medium text-gray-900">{product.brand}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500">Category:</span>
                <p className="text-base sm:text-lg text-gray-900">{product.category}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500">Price:</span>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500">Quantity:</span>
                <p className="text-base sm:text-lg text-gray-900">{product.quantity}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500">Status:</span>
                <p className="text-base sm:text-lg text-gray-900">
                  <span className={`inline-block px-2 py-1 rounded text-sm ${
                    product.status === 'Available' ? 'bg-green-100 text-green-800' :
                    product.status === 'Out of Stock' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.status}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500">SKU:</span>
                <p className="text-base sm:text-lg text-gray-900 font-mono">{product.sku}</p>
              </div>
              {product.rating > 0 && (
                <div>
                  <span className="text-sm font-semibold text-gray-500">Rating:</span>
                  <p className="text-base sm:text-lg text-gray-900 flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    {product.rating.toFixed(1)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}