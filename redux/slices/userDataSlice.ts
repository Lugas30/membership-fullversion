import { createSlice } from "@reduxjs/toolkit";
import { getUserData } from "../thunks/userDataThunk";

interface UserState {
  loading: boolean;
  error: string | null;
  userData: any; // Sesuaikan tipe data user sesuai dengan struktur respons API
}

const initialState: UserState = {
  loading: false,
  error: null,
  userData: null,
};

const usersSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.userData = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUser } = usersSlice.actions;
export default usersSlice.reducer;
