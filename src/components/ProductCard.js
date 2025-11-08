"use client"
import React from 'react'

export default function ProductCard({p, onClick}){
  const originalPrice = p.price * 1.5 // Simulate original price for discount display
  const discount = Math.round(((originalPrice - p.price) / originalPrice) * 100)

  return (
    <div onClick={()=>onClick(p)} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg cursor-pointer transition-all duration-200 border border-gray-100 h-full flex flex-col">
      <div className="relative aspect-square sm:aspect-[4/3]">
        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
        {p.status === 'Available' && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs sm:text-sm px-2 py-1 rounded">
            In Stock
          </div>
        )}
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs sm:text-sm px-2 py-1 rounded font-semibold">
            -{discount}%
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-sm sm:text-base text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
          {p.name}
        </h3>
        <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
          <span className="text-base sm:text-lg font-bold text-gray-900">${p.price.toFixed(2)}</span>
          {discount > 0 && (
            <span className="text-xs sm:text-sm text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
          )}
        </div>
        {p.rating > 0 && (
          <div className="flex items-center gap-1 text-xs sm:text-sm text-yellow-500 mt-auto">
            <span>⭐</span>
            <span>{p.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
