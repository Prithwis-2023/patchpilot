import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import { JetBrains_Mono, IBM_Plex_Sans, Fira_Code } from "next/font/google";
import "./globals.css";
import DynamicBackground from "./components/DynamicBackground";
import FloatingParticles from "./components/FloatingParticles";
import CustomCursor from "./components/CustomCursor";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PatchPilot - Transform Bug Recordings into Fixes",
  description: "Upload a screen recording of a bug and get timeline, reproduction steps, Playwright test, and suggested fix patch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Always use dark theme for cybernetic brutalism design
                document.documentElement.classList.add('dark');
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${jetbrainsMono.variable} ${ibmPlexSans.variable} ${firaCode.variable} antialiased bg-background text-foreground`}
      >
        {/* Global background layers - behind content but visible */}
        <div className="fixed inset-0 diagonal-grid opacity-50 pointer-events-none z-0" />
        <div className="fixed inset-0 scanlines pointer-events-none z-0" />
        <DynamicBackground />
        <FloatingParticles />
        <CustomCursor />

        {/* Main content */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
