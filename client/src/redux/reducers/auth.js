import { createSlice } from "@reduxjs/toolkit";
import { adminLogin, getAdmin, logoutAdmin } from "../thunks/admin";
import toast from "react-hot-toast";
const initialState = {
  user: null,
  isAdmin: false,
  loader: true,
  adminLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userExists: (state, action) => {
      state.user = action.payload;
      state.loader = false;
    },
    userNotExists: (state) => {
      state.user = null;
      state.loader = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.isAdmin = true;
        toast.success(action.payload);
      })
      .addCase(adminLogin.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.adminLoading = false;
        state.isAdmin = false;
        toast.error(action.error.message);
      })
      .addCase(getAdmin.fulfilled, (state, action) => {
        state.adminLoading = false;
        if (action.payload) {
          state.isAdmin = action.payload;
          toast.success("Logged in successfully");
        } else {
          state.isAdmin = false;
          toast.error(action.error.message);
        }
      })
      .addCase(getAdmin.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(getAdmin.rejected, (state, action) => {
        state.adminLoading = false;
        state.isAdmin = false;
        toast.error(action.error.message);
      })
      .addCase(logoutAdmin.fulfilled, (state, action) => {
        state.isAdmin = false;
        toast.success(action.payload.message);
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.isAdmin = true;
        toast.error(action.error.message);
      });
  },
});
export const { userExists, userNotExists } = authSlice.actions;
export default authSlice;
