import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "실버노트 — 부모님의 따뜻한 하루를 함께합니다",
  description: "요양원에 계신 부모님의 일상을 가족과 함께 기록하고, 건강한 생활을 지원하는 통합 소통 플랫폼",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#fff",
              color: "#262626",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              padding: "14px 18px",
              fontSize: "15px",
              fontWeight: "500",
              border: "1px solid #e5e5e5",
            },
            success: {
              iconTheme: { primary: "#0d9488", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#dc2626", secondary: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}
