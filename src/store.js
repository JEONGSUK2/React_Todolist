import { configureStore, createSlice } from "@reduxjs/toolkit";

let user = createSlice({
  name: "user",
  initialState : {
    loggedIn : false,
    data : null,
    uid : null
  },
  reducers: {
    logIn: (state, action) =>{
        state.loggedIn = true;
        state.uid = action.payload;
    },
    loggedIn : (state, action)=>{
        state.loggedIn = true;
        state.data = action.payload;
    },
    logOut : (state, action) =>{
        state.loggedIn = false;
        state.data = null;
        state.uid = null;
    }  
  }
})

let dark = createSlice({
    name : "dark",
    initialState : "light",
    reducers : {
        toggleTheme : (state) => state === "light" ? "dark" : "light"
    }
})

let state = createSlice({
    name: "id",
    initialState : "100살"
})
export const {logIn, logOut, loggedIn} = user.actions
export const {toggleTheme} = dark.actions


export default configureStore({
    reducer :{
        user : user.reducer,
        state : state.reducer,
        dark : dark.reducer
    }
})
//Redux 기본 세팅
// 복잡할 구조일 경우 사용 , 그외 간단한 단계는 props 이용 가능