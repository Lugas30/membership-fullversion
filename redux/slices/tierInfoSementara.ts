import { createSlice } from "@reduxjs/toolkit";
import { getTierInfo } from "../thunks/tierInfoSementara";

interface TierInfoState {
  loading: boolean;
  error: string | null;
  data: any; // Sesuaikan tipe data data sesuai dengan struktur respons API
}

const initialState: TierInfoState = {
  loading: false,
  error: null,
  data: null,
};

const tierInfoSlice = createSlice({
  name: "tierInfo",
  initialState,
  reducers: {
    // Tambahkan reducers jika diperlukan
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTierInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTierInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getTierInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default tierInfoSlice.reducer;
