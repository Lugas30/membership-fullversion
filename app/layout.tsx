"use client";
import "./globals.css";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { GoogleTagManager } from "@next/third-parties/google";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta
          name="description"
          content="Bergabunglah dengan AMS Membership dan nikmati keuntungan eksklusif dari brand ternama seperti Celcius, Celcius Woman, Mississippi, dan Queensland! Aplikasi ini memberikan akses langsung ke voucher diskon, promo menarik, serta informasi terbaru seputar produk dan layanan. Dapatkan pengalaman belanja yang lebih personal dan hemat, hanya dengan menjadi bagian dari AMS Membership. Jangan lewatkan penawaran eksklusif yang hanya tersedia untuk member!"
        />
        <meta
          name="keywords"
          content="AMS Membership, Celcius, Celcius Woman, Mississippi, Queensland, Program membership fashion, AMS member, Celcius Member, Mississippi Member, Queensland Member"
        />
        <meta name="robots" content="index, follow" />

        <title>AMS Membership</title>

        {/* Google Tag Manager & Analytics */}

        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-BCQ06P5FG5"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-BCQ06P5FG5');
    `,
          }}
        />
      </head>
      <body className="bg-slate-100">
        <Provider store={store}>{children}</Provider>
        {/* <GoogleTagManager gtmId="G-BCQ06P5FG5" /> */}
      </body>
    </html>
  );
}
