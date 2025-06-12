// src/app/layout.js

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CarparkProvider } from '@/context/CarparkContext';


const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "旅遊停車地圖",
  description: "整合 TDX 停車與觀光 API 的服務",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <CarparkProvider>
          {children}
        </CarparkProvider>
      </body>
    </html>
  );
}
