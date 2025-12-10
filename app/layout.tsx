import type { Metadata } from "next";
import StarBackground from "@/components/StarBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: "خريطة الأقدار وقراءة الكف | رؤية كونية",
  description: "اكتشف مسارك من خلال علم الخرائط الفلكية وقراءة الكف بالذكاء الاصطناعي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Philosopher:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <StarBackground />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
