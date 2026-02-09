import "./globals.css";

export const metadata = { title: "NeonMart", description: "Demo shop for PatchPilot" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#070A13] text-slate-100">{children}</body>
    </html>
  );
}