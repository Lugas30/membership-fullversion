import { createSlice } from "@reduxjs/toolkit";
import { getUsers } from "../thunks/usersThunks";

interface UserState {
  loading: boolean;
  error: string | null;
  user: any; // Sesuaikan tipe data user sesuai dengan struktur respons API
}

const initialState: UserState = {
  loading: false,
  error: null,
  user: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUser } = usersSlice.actions;
export default usersSlice.reducer;
