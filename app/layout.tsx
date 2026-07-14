import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import PwaRegister from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: "실버노트 — 가족이 부모님의 하루를 믿고 느낄 수 있는 시니어 케어 OS",
  description:
    "보호사는 2분 퀵작성, 보호자는 앱 없이 10초 안심. 알림장·식단·타임라인·소통 리포트까지 요양원과 가족을 잇는 실버노트.",
  applicationName: "실버노트",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "실버노트",
  },
  icons: {
    icon: [{ url: "/icon.svg" }, { url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: "/icon-192.png",
  },
  openGraph: {
    title: "실버노트",
    description: "가족이 부모님의 하루를 믿고 느낄 수 있는 시니어 케어 OS",
    locale: "ko_KR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F6E6A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/variable/woff2/SUIT-Variable.css"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <PwaRegister />
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
