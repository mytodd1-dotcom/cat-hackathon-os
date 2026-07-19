import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CAT Hackathon OS",
  description:
    "A Codex-powered command center for turning hackathons into repeatable shipping loops.",
  openGraph: {
    title: "CAT Hackathon OS",
    description: "Find the right build. Ship the proof.",
    images: ["https://cat-hackathon-os.flyguy.chatgpt.site/cat-hackathon-os-title-card.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "CAT Hackathon OS",
    description: "Find the right build. Ship the proof.",
    images: ["https://cat-hackathon-os.flyguy.chatgpt.site/cat-hackathon-os-title-card.jpg"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
