import { createSlice } from "@reduxjs/toolkit";
import { getBrand } from "../thunks/brandThunks";

interface BrandState {
  loading: boolean;
  error: string | null;
  data: any; // Sesuaikan tipe data data sesuai dengan struktur respons API
}

const initialState: BrandState = {
  loading: false,
  error: null,
  data: null,
};

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    // Tambahkan reducers jika diperlukan
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default brandSlice.reducer;
