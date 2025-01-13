import { createSlice } from "@reduxjs/toolkit";
import { getCategoryPromo } from "../thunks/categoryPromoThunks";

interface CategoryPromoState {
  loading: boolean;
  error: string | null;
  data: any; // Sesuaikan tipe data data sesuai dengan struktur respons API
}

const initialState: CategoryPromoState = {
  loading: false,
  error: null,
  data: null,
};

const promoSlice = createSlice({
  name: "categoryPromo",
  initialState,
  reducers: {
    // Tambahkan reducers jika diperlukan
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategoryPromo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategoryPromo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getCategoryPromo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default promoSlice.reducer;
