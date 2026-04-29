import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "600", "800", "900"],
  style: ["normal", "italic"]
});

export const metadata: Metadata = {
  title: "Diagnóstico Especialista CAN BUS",
  description: "Descubra se você é um trocador de peças ou um especialista em diagnósticos avançados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${montserrat.variable} font-sans antialiased bg-black text-slate-50`}
      >
        {children}
      </body>
    </html>
  );
}
