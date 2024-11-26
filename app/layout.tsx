import type { Metadata } from "next";
import localFont from "next/font/local";
import { Silkscreen } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
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
      <head>

       <meta property="og:site_name" content="Power Card Generator" />
        <meta property="og:title" content="Power Card Generator" />
        <meta property="og:description" content="Get a power card for your website" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://cardify.maximalstudio.in" />
      </head>
      <body
        className={`antialiased relative ${silkscreen.className} ${silkscreen.variable}`}
      >
        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#121212_50%,#10b981_150%)]"></div>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>
          
        </div>
        <Toaster richColors/>
        <Analytics />
      </body>
    </html>
  );
}
