import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getBrand = createAsyncThunk(
  "promo/getBrand",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}brand`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Terjadi kesalahan");
    }
  }
);
