import type { Metadata } from "next";
import localFont from "next/font/local";
import { Silkscreen } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const silkscreen = Silkscreen({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-silkscreen",
});

export const metadata: Metadata = {
  title: "Power Card Generator",
  description: "Get a power card for your website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased ${silkscreen.className} ${silkscreen.variable}`}
      >
        {children}
        <Toaster richColors/>
      </body>
      
    </html>
  );
}
