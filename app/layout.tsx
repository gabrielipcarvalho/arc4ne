import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import Rain from "./Rain";
import "./globals.css";

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://arc4ne.io"),
  title: "ARC4NE — an arc for Ne · systems architecture · software engineering · applied AI",
  description:
    "arc4ne — an arc for Ne. Neon sits dark until an arc strikes through it: you bring the neon, we bring the arc. Systems architecture, software engineering, applied AI. Alpha.",
  keywords: [
    "systems architecture",
    "software engineering",
    "SaaS",
    "applied AI",
    "consulting",
    "Australia",
  ],
  openGraph: {
    title: "ARC4NE — an arc for Ne",
    description:
      "You bring the neon. We bring the arc. — systems architecture · software engineering · applied AI.",
    url: "https://arc4ne.io",
    siteName: "arc4ne",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <body>
        <Rain />
        {children}
      </body>
    </html>
  );
}
