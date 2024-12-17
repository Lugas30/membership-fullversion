import { createSlice } from "@reduxjs/toolkit";
import { getRewards } from "../thunks/rewardsThunks";

interface RewardsState {
  loading: boolean;
  error: string | null;
  data: any; // Sesuaikan tipe data data sesuai dengan struktur respons API
}

const initialState: RewardsState = {
  loading: false,
  error: null,
  data: null,
};

const rewardsSlice = createSlice({
  name: "rewards",
  initialState,
  reducers: {
    // Tambahkan reducers jika diperlukan
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRewards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRewards.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getRewards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default rewardsSlice.reducer;
