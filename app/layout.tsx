import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AdScript } from "@/components/ads/AdScript";

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: "JustSayYes — Create a Funny Dating Invitation ❤️",
  description: "Create a funny dating invitation, send it to someone you like, and let them try to say no. Create your personalized invitation in seconds.",
  alternates: { canonical: "/" },
  openGraph: { title: "JustSayYes ❤️", description: "Someone has a question for you...", type: "website" },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AdScript />
        {children}
      </body>
    </html>
  );
}
