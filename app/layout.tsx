import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import PwaRegister from "@/components/PwaRegister";

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});

const suit = localFont({
  src: "../public/fonts/SUIT-Variable.woff2",
  variable: "--font-suit",
  display: "swap",
  weight: "100 900",
});

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
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "실버노트",
    description: "가족이 부모님의 하루를 믿고 느낄 수 있는 시니어 케어 OS",
    locale: "ko_KR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#176C62",
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
    <html lang="ko" className={`${pretendard.variable} ${suit.variable}`}>
      <body>
        {children}
        <PwaRegister />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: "var(--sn-surface)",
              color: "var(--sn-ink)",
              borderRadius: "var(--sn-radius)",
              boxShadow: "var(--sn-shadow-2)",
              padding: "14px 18px",
              fontSize: "var(--sn-type-sm)",
              fontWeight: "500",
              border: "1px solid var(--sn-line)",
            },
            success: {
              iconTheme: { primary: "#176c62", secondary: "#fff" },
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
