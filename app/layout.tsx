"use client";
import "./globals.css";
import { Provider } from "react-redux";
import store from "@/redux/store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>AMS Membership</title>
      </head>
      <body className="bg-slate-100">
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
