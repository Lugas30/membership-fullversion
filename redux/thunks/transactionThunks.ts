import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getTransaction = createAsyncThunk(
  "promo/getTransaction",
  async (_, { rejectWithValue }) => {
    try {
      const member = localStorage.getItem("member");
      const token = localStorage.getItem("token");
      if (!member) {
        return rejectWithValue("Member ID tidak ditemukan");
      }
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}transaction/history?memberID=${member}`,
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
