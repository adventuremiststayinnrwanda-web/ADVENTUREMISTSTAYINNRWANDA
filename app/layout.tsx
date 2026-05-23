import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StayEase Hotel Booking",
  description: "Guest-first hotel room booking and management platform"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
