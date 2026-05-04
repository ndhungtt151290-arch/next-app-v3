import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thi thử 原付 · 50cc (Nhật)",
  description: "Ôn lý thuyết & thi thử 48 câu bằng xe máy 50cc Nhật Bản",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
