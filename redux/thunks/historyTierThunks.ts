import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getHistoryTier = createAsyncThunk(
  "tier/getHistoryTier",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const member = localStorage.getItem("member");
      if (!member) {
        return rejectWithValue("Member ID tidak ditemukan");
      }
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}tier/hitory?memberID=${member}`,
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
