import { createSlice } from "@reduxjs/toolkit";
import { getPointExpired } from "../thunks/pointExpiredThunks";

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

const pointExpiredSlice = createSlice({
  name: "pointExpired",
  initialState,
  reducers: {
    // Tambahkan reducers jika diperlukan
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPointExpired.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPointExpired.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getPointExpired.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default pointExpiredSlice.reducer;
