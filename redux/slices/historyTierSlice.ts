import { createSlice } from "@reduxjs/toolkit";
import { getHistoryTier } from "../thunks/historyTierThunks";

interface TierHistoryState {
  loading: boolean;
  error: string | null;
  data: any; // Sesuaikan tipe data data sesuai dengan struktur respons API
}

const initialState: TierHistoryState = {
  loading: false,
  error: null,
  data: null,
};

const pointSlice = createSlice({
  name: "tierHistory",
  initialState,
  reducers: {
    // Tambahkan reducers jika diperlukan
  },
  extraReducers: (builder) => {
    builder
      .addCase(getHistoryTier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHistoryTier.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getHistoryTier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default pointSlice.reducer;
