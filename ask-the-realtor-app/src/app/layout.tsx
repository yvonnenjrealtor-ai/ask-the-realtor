import type { Metadata } from "next";
import "./globals.css";

export const metadata = {
  title: "Chat Homes AI | Yvonne Sanford",
  description: "Smart, guided real estate answers for New Jersey buyers and sellers.",
  applicationName: "Chat Homes AI",
  appleWebApp: {
    title: "Chat Homes AI",
    capable: true,
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link rel="manifest" href="/manifest.json" />
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}


