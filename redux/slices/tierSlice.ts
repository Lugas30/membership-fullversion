import { createSlice } from "@reduxjs/toolkit";
import { getTier } from "../thunks/tierThunks";

interface TierState {
  loading: boolean;
  error: string | null;
  data: any; // Sesuaikan tipe data data sesuai dengan struktur respons API
}

const initialState: TierState = {
  loading: false,
  error: null,
  data: null,
};

const tierSlice = createSlice({
  name: "tier",
  initialState,
  reducers: {
    // Tambahkan reducers jika diperlukan
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTier.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getTier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default tierSlice.reducer;
