"use client"
import React from 'react'

export default function Pagination({page, totalPages, setPage}){
  const pages = []
  const maxVisiblePages = 5
  
  // Calculate visible pages
  let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
  
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }
  
  for(let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  
  return (
    <div className="flex flex-wrap gap-2 items-center justify-center mt-4 sm:mt-6">
      <button 
        onClick={()=>setPage(p=>Math.max(1,p-1))} 
        disabled={page === 1}
        className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
      >
        Prev
      </button>
      
      {startPage > 1 && (
        <>
          <button 
            onClick={()=>setPage(1)} 
            className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2 text-gray-500 dark:text-gray-400">...</span>}
        </>
      )}
      
      {pages.map(p=> (
        <button 
          key={p} 
          onClick={()=>setPage(p)} 
          className={`px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border rounded-lg transition-colors bg-white dark:bg-gray-800 ${
            p===page 
              ? 'bg-purple-600 text-white border-purple-600' 
              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {p}
        </button>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2 text-gray-500 dark:text-gray-400">...</span>}
          <button 
            onClick={()=>setPage(totalPages)} 
            className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button 
        onClick={()=>setPage(p=>Math.min(totalPages,p+1))} 
        disabled={page === totalPages}
        className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
      >
        Next
      </button>
    </div>
  )
}
