import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adventure Mist Stay Inn Rwanda",
  description: "Adventure Mist Stay Inn Rwanda is your trusted travel and hotel booking partner in Rwanda. Whether you're planning a vacation, business trip, honeymoon, or family getaway, we help you discover and book the perfect hotel with ease.",
  openGraph: {
    title: "Adventure Mist Stay Inn Rwanda | Hotel & Travel Booking Partner",
    description: "Adventure Mist Stay Inn Rwanda is your trusted travel and hotel booking partner in Rwanda. Compare accommodations, secure the best rates, and enjoy a smooth booking experience.",
  },
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[var(--background)] text-[var(--foreground)] antialiased`}>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
