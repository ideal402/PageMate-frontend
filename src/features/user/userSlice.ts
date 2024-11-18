import { createAsyncThunk, createSlice, isRejectedWithValue, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { NavigateFunction } from "react-router-dom";


interface UserState{
    user: User | null;
    loading:boolean;
    loginError:string|null;
    registrationError:string|null;
    success:boolean;
}

const initialState: UserState = {
    user:null,
    loading:false,
    loginError:null,
    registrationError:null,
    success:false,
}

interface User {
    email: string;
    name: string;
}

interface LoginPayload {
    email:string;
    password:string;
}

interface RegisterPayload {
    email: string;
    name: string;
    password: string;
    navigate: NavigateFunction;
}

export const registerUser = createAsyncThunk<User, RegisterPayload, {rejectValue:string}>(
    "user/registerUser",
    async({email, name, password, navigate} ,{rejectWithValue}) => {
        try {
            const response = await axios.post("/api/user",{email, name, password})
            navigate("/login")

            return response.data
            
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const loginWithEmail = createAsyncThunk<User, LoginPayload, {rejectValue:string}>(
    "user/loginWithEmail",
    async ({email, password}, {rejectWithValue}) => {
        try {
            const response = await axios.post("/auth/login",{email, password})
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.loginError = null;
            state.registrationError = null;
          },      
    },
    extraReducers: (builder) => {
        builder
        .addCase(registerUser.pending, (state)=>{
            state.loading = true;
            state.registrationError = null;
        })
        .addCase(registerUser.fulfilled, (state)=>{
            state.loading = false;
            state.registrationError = null;
        })
        .addCase(registerUser.rejected, (state, action)=>{
            state.loading = false;
            state.registrationError = action.payload||"register failed";
        })
        .addCase(loginWithEmail.pending, (state)=>{
            state.loading = true;
            state.loginError = null;
        })
        .addCase(loginWithEmail.fulfilled, (state, action)=>{
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(loginWithEmail.rejected, (state, action)=>{
            state.loading = false;
            state.loginError = action.payload || "login failed";
        });
    },
})

export const {clearErrors} = userSlice.actions
export default userSlice.reducer;