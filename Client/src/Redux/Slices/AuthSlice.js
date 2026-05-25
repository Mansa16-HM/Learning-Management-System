import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../Helpers/axiosinstance"

const isBrowser = typeof window !== "undefined";

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const initialState = {
  isLoggedIn: isBrowser ? localStorage.getItem("isLoggedIn") === "true" : false,
  role: isBrowser ? localStorage.getItem("role") || "" : "",
  data: isBrowser ? safeParse(localStorage.getItem("data"), {}) : {},
};

export const creatAccount = createAsyncThunk("/auth/singup", async (data) => {
    try {
        const res = axiosInstance.post("user/register", data);
        toast.promise(res, {
            loading: "Wait, creating your account",
            success: (data) => data?.data?.message,
            error: "Failed to create account"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

export const login = createAsyncThunk("/auth/login", async (data) => {
    try {
        const res = axiosInstance.post("user/login", data);
        toast.promise(res, {
            loading: "Wait, authentication in process...",
            success: (data) => data?.data?.message,
            error: "Failed to login"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

export const logout = createAsyncThunk("/auth/logout", async () => {
    try {
        const res = axiosInstance.post("user/logout");
        toast.promise(res, {
            loading: "Wait, logout in process...",
            success: (data) => data?.data?.message,
            error: "Failed to logout"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

export const updateProfile = createAsyncThunk("/user/update/profile", async (data) => {
    try {
        const res = axiosInstance.put(`user/update`, data);
        toast.promise(res, {
            loading: "Wait, profile update in process...",
            success: (data) => data?.data?.message,
            error: "Failed to update profile"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

export const getuserData = createAsyncThunk("/user/details", async () => {
    try {
        const res = await axiosInstance.get("user/me");
        return res.data;
    } catch (error) {
        toast.error(error?.message);
    }
});

export const forgetPassword = createAsyncThunk("/auth/forget-Password", async (data) => {
    try {
        const res = axiosInstance.post("user/reset", data);
        toast.promise(res, {
            loading: "Wait, forget password in process...",
            success: (data) => data?.data?.message,
            error: "Failed to send reset email"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

export const changePassword = createAsyncThunk("/auth/changePassword", async (userPassword) => {
    try {
        let res = axiosInstance.post("/user/change-password", userPassword);
        toast.promise(res, {
            loading: "Wait, changing password...",
            success: (data) => data?.data?.message,
            error: "Failed to change password"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

export const resetPassword = createAsyncThunk("/user/reset", async (data) => {
    try {
        let res = axiosInstance.post(`/user/reset/${data.resetToken}`, { password: data.password });
        toast.promise(res, {
            loading: "Wait, resetting password...",
            success: (data) => data?.data?.message,
            error: "Failed to reset password"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(creatAccount.fulfilled, (state, action) => {
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", action?.payload?.user?.role);
            state.data = action?.payload?.user;
            state.role = action?.payload?.user?.role;
            state.isLoggedIn = true;
        })
        .addCase(login.fulfilled, (state, action) => {
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", action?.payload?.user?.role);
            state.data = action?.payload?.user;
            state.role = action?.payload?.user?.role;
            state.isLoggedIn = true;
        })
        .addCase(logout.fulfilled, (state) => {
            localStorage.clear();
            state.data = {};
            state.isLoggedIn = false;
            state.role = "";
        })
        .addCase(getuserData.fulfilled, (state, action) => {
            // ✅ FIXED: was "if(user) return" which skipped update when user existed
            if (!action?.payload?.user) return;
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", action?.payload?.user?.role);
            state.isLoggedIn = true;
            state.data = action?.payload?.user;
            state.role = action?.payload?.user?.role;
        })
    }
});

export default authSlice.reducer;