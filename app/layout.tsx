import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "케어링노트 - 부모님의 따뜻한 하루를 함께합니다",
  description: "요양원에 계신 부모님의 일상을 가족과 함께 공유하고, 건강한 생활을 지원하는 통합 소통 플랫폼",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
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
      <body className="font-pretendard antialiased">
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#1f2937',
              borderRadius: '16px',
              boxShadow: '0 20px 60px -10px rgba(0, 0, 0, 0.15)',
              padding: '18px 20px',
              fontSize: '15px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#0d8ae8',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
