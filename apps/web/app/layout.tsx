import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { Inter } from "next/font/google";

// Configure the font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans", // defines a CSS variable
});

export const fontSans = inter;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
