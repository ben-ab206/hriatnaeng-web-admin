import { Providers } from "./providers";
import "./globals.css";
import { ClientLayout } from "@/components/layout/client-layout";
import { Toaster } from "@/components/ui/toaster";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins", // Custom CSS variable
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-poppins">
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
