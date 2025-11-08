import { createSlice } from '@reduxjs/toolkit'
import productsData from '../products.json'

const persisted = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('products_v1') || 'null') : null
const initialState = { items: persisted || productsData }

const productsSlice = createSlice({ name:'products', initialState, reducers: {
  addProduct(state,action){ state.items.unshift(action.payload); if(typeof window!=='undefined') localStorage.setItem('products_v1', JSON.stringify(state.items)) },
  setProducts(state,action){ state.items = action.payload; if(typeof window!=='undefined') localStorage.setItem('products_v1', JSON.stringify(state.items)) }
}})

export const { addProduct, setProducts } = productsSlice.actions
export default productsSlice.reducer