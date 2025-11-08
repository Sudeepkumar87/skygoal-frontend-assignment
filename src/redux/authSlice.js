import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import Cookies from 'js-cookie'

export const signupUser = createAsyncThunk('auth/signup', async ({email,password},{rejectWithValue})=>{
  try{
    const cred = await createUserWithEmailAndPassword(auth,email,password)
    const token = await cred.user.getIdToken()
    Cookies.set('sky_token', token)
    return { email: cred.user.email, uid: cred.user.uid }
  }catch(e){ return rejectWithValue(e.message) }
})

export const loginUser = createAsyncThunk('auth/login', async ({email,password},{rejectWithValue})=>{
  try{
    const cred = await signInWithEmailAndPassword(auth,email,password)
    const token = await cred.user.getIdToken()
    Cookies.set('sky_token', token)
    return { email: cred.user.email, uid: cred.user.uid }
  }catch(e){ return rejectWithValue(e.message) }
})

export const logoutUser = createAsyncThunk('auth/logout', async ()=>{
  await signOut(auth)
  Cookies.remove('sky_token')
  return true
})

const authSlice = createSlice({ name: 'auth', initialState: { user: null, loading:false, error:null }, reducers: { setUser(state,action){ state.user = action.payload } }, extraReducers: builder => {
  builder
  .addCase(signupUser.pending,(s)=>{s.loading=true;s.error=null})
  .addCase(signupUser.fulfilled,(s,action)=>{s.loading=false;s.user=action.payload})
  .addCase(signupUser.rejected,(s,action)=>{s.loading=false;s.error=action.payload})
  .addCase(loginUser.pending,(s)=>{s.loading=true;s.error=null})
  .addCase(loginUser.fulfilled,(s,action)=>{s.loading=false;s.user=action.payload})
  .addCase(loginUser.rejected,(s,action)=>{s.loading=false;s.error=action.payload})
  .addCase(logoutUser.fulfilled,(s)=>{s.user=null})
}}
)
export const { setUser } = authSlice.actions
export default authSlice.reducer