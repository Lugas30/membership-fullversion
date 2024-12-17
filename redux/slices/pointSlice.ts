import { createSlice } from "@reduxjs/toolkit";
import { getPoint } from "../thunks/pointThunks";

interface PointState {
  loading: boolean;
  error: string | null;
  data: any; // Sesuaikan tipe data data sesuai dengan struktur respons API
}

const initialState: PointState = {
  loading: false,
  error: null,
  data: null,
};

const pointSlice = createSlice({
  name: "points",
  initialState,
  reducers: {
    // Tambahkan reducers jika diperlukan
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPoint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPoint.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getPoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default pointSlice.reducer;
