import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Earning Tracker",
  description: "Track your freelance earnings efficiently.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
          <body className={`${geistSans.variable} ${geistMono.variable} bg-gray-100`}>
              <Navbar />
              <main className="p-6">{children}</main>
          </body>
      </html>
  );
}
