import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getTier = createAsyncThunk(
  "tier/getTier",
  async (_, { rejectWithValue }) => {
    try {
      const member = localStorage.getItem("member");
      const token = localStorage.getItem("token");
      if (!member) {
        return rejectWithValue("Member ID tidak ditemukan");
      }
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}tier/list?memberID=${member}`,
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
