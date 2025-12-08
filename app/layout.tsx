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
      <body>
        <StarBackground />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
