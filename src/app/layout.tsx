import type { Metadata } from "next";
import { Inter, Roboto_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import AdminTrigger from "@/components/AdminTrigger";
import DatabaseHydrator from "@/components/DatabaseHydrator";
import CyberCursor from "@/components/CyberCursor";
import TopNav from "@/components/TopNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dharshan Security Framework | Cybersecurity Portfolio",
  description: "Personal command center and portfolio for Dharshan Kumar B. Cybersecurity, Cloud, AI, and Secure Systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${robotoMono.variable} ${orbitron.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-cyber-black text-cyber-text selection:bg-cyber-neon selection:text-black">
        <DatabaseHydrator />
        <div className="scanlines" />
        <CyberCursor />
        <TopNav />
        <AdminTrigger />
        {children}
      </body>
    </html>
  );
}
