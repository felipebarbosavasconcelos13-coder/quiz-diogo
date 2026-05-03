import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import UtmTracker from "@/components/UtmTracker";
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
      <head>
        <link rel="preconnect" href="https://pay.hotmart.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <Script id="gtm-head" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-TF229MRB');`}
        </Script>
      </head>
      <body
        className={`${montserrat.variable} font-sans antialiased bg-black text-slate-50`}
      >
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TF229MRB"
          height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe>
        </noscript>
        <UtmTracker />
        {children}
      </body>
    </html>
  );
}
