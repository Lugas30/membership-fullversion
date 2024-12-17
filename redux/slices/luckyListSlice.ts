import { createSlice } from "@reduxjs/toolkit";
import { getLuckyList } from "../thunks/luckyListThunks";

interface LuckyListState {
  loading: boolean;
  error: string | null;
  data: any; // Sesuaikan tipe data data sesuai dengan struktur respons API
}

const initialState: LuckyListState = {
  loading: false,
  error: null,
  data: null,
};

const luckyListSlice = createSlice({
  name: "luckyList",
  initialState,
  reducers: {
    // Tambahkan reducers jika diperlukan
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLuckyList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLuckyList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getLuckyList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default luckyListSlice.reducer;
