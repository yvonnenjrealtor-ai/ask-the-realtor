import type { Metadata } from "next";
import "./globals.css";

export const metadata = {
  title: "Talk to the Realtor",
  applicationName: "Talk to the Realtor",
  appleWebApp: {
    title: "Talk to the Realtor",
    capable: true,
  },
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


