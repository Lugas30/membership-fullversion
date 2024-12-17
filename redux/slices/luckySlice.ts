import { createSlice } from "@reduxjs/toolkit";
import { getLucky } from "../thunks/luckyThunks";

interface LuckyState {
  loading: boolean;
  error: string | null;
  data: any; // Sesuaikan tipe data data sesuai dengan struktur respons API
}

const initialState: LuckyState = {
  loading: false,
  error: null,
  data: null,
};

const luckySlice = createSlice({
  name: "lucky",
  initialState,
  reducers: {
    // Tambahkan reducers jika diperlukan
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLucky.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLucky.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getLucky.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default luckySlice.reducer;
