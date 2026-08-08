import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://arc4ne.io"),
  title: "ARC4NE — systems architecture · software engineering · applied AI",
  description:
    "arc4ne is a systems architecture and software engineering outfit — services, SaaS, and applied AI, built to hold up in production. Alpha.",
  keywords: [
    "systems architecture",
    "software engineering",
    "SaaS",
    "applied AI",
    "consulting",
    "Australia",
  ],
  openGraph: {
    title: "ARC4NE",
    description:
      "systems architecture · software engineering · applied AI — built to hold up in production.",
    url: "https://arc4ne.io",
    siteName: "arc4ne",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <body>{children}</body>
    </html>
  );
}
