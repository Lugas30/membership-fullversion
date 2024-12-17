import { createSlice } from "@reduxjs/toolkit";
import { getVoucherList } from "../thunks/voucherListThunk";

interface VoucherListState {
  loading: boolean;
  error: string | null;
  data: any; // Sesuaikan tipe data data sesuai dengan struktur respons API
}

const initialState: VoucherListState = {
  loading: false,
  error: null,
  data: null,
};

const voucherListSlice = createSlice({
  name: "voucher",
  initialState,
  reducers: {
    // Tambahkan reducers jika diperlukan
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVoucherList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVoucherList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getVoucherList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default voucherListSlice.reducer;
