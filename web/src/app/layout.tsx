import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mise — nineteen ingredients, one kitchen",
  description:
    "A cinematic studio for the modern web stack. Nineteen open-source ingredients, a real backend, and a kitchen that will compose your plate.",
  icons: { icon: "/images/mark.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="grain" />
        <Header />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
