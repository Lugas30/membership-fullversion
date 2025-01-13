import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getCategoryPromo = createAsyncThunk(
  "promo/getCategoryPromo",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://golangapi-j5iu.onrender.com/api/v2.0/member/mobile/promo/category`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Terjadi kesalahan");
    }
  }
);
