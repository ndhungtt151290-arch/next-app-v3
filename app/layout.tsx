import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thi thử 原付 · 50cc (Nhật)",
  description: "Ôn lý thuyết & thi thử 48 câu bằng xe máy 50cc Nhật Bản",
};

/** iPhone notch / home indicator — dùng với env(safe-area-inset-*) */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased" style={{ width: "fit-content" }}>
        {children}
      </body>
    </html>
  );
}
