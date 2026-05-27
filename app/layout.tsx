import { Geist, Raleway, Cormorant_Garamond, Roboto_Condensed } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans" });

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const robotoCond = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-condensed",
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: {
    default: "AfixZ Store — Plants, Compost & Pots",
    template: "%s | AfixZ Store",
  },
  description:
    "Premium plants, organic vermicompost and handpicked pots delivered across Delhi NCR.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://store.afixz.com"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        geistSans.variable,
        raleway.variable,
        cormorant.variable,
        robotoCond.variable
      )}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
