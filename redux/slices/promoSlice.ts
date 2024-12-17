import { createSlice } from "@reduxjs/toolkit";
import { getPromo } from "../thunks/promoThunks";

interface PromoState {
  loading: boolean;
  error: string | null;
  data: any; // Sesuaikan tipe data data sesuai dengan struktur respons API
}

const initialState: PromoState = {
  loading: false,
  error: null,
  data: null,
};

const promoSlice = createSlice({
  name: "promo",
  initialState,
  reducers: {
    // Tambahkan reducers jika diperlukan
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPromo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPromo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getPromo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default promoSlice.reducer;
