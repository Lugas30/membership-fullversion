import { createSlice } from "@reduxjs/toolkit";
import { getVoucher } from "../thunks/voucherThunks";

interface VoucherState {
  loading: boolean;
  error: string | null;
  data: any; // Sesuaikan tipe data data sesuai dengan struktur respons API
}

const initialState: VoucherState = {
  loading: false,
  error: null,
  data: null,
};

const voucherSlice = createSlice({
  name: "voucher",
  initialState,
  reducers: {
    // Tambahkan reducers jika diperlukan
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVoucher.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default voucherSlice.reducer;
