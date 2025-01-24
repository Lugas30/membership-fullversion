import { createSlice } from "@reduxjs/toolkit";
import { getContact } from "../thunks/contactThunks";

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

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    // Tambahkan reducers jika diperlukan
  },
  extraReducers: (builder) => {
    builder
      .addCase(getContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContact.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default contactSlice.reducer;
