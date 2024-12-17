import { createSlice } from "@reduxjs/toolkit";
import { getStore } from "../thunks/storeThunks";

interface StoreState {
  loading: boolean;
  error: string | null;
  data: any; // Sesuaikan tipe data data sesuai dengan struktur respons API
}

const initialState: StoreState = {
  loading: false,
  error: null,
  data: null,
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    // Tambahkan reducers jika diperlukan
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStore.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default storeSlice.reducer;
