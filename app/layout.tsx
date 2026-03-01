import type { Metadata } from "next";
import { Poppins, Rajdhani } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
});

export const metadata: Metadata = {
  title: "Stock Website Change Radar | DataPAI × TinyFish × ag2",
  description: "Monitor US stock company websites for wording changes — a DataPAI project powered by TinyFish and ag2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${rajdhani.variable}`}>
      <body className="min-h-screen bg-[#fcfcfd] text-[#252525] antialiased">

        {/* White navbar — datap.ai style with all three brand logos */}
        <header className="bg-white border-b border-gray-100" style={{ boxShadow: "0 2px 10px rgba(0,0,0,.06)" }}>
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

            {/* Left: DataPAI brand logo */}
            <a href="https://www.datap.ai" target="_blank" rel="noopener noreferrer" title="DataPAI">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/datapai-logo.png" alt="DataPAI" style={{ height: "36px", width: "auto" }} />
            </a>

            {/* Centre: "Powered by" partners */}
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-xs font-medium uppercase tracking-widest">Powered by</span>
              <a href="https://tinyfish.ai" target="_blank" rel="noopener noreferrer" title="TinyFish">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/tinyfish-logo.svg" alt="TinyFish" style={{ height: "24px", width: "auto" }} />
              </a>
              <span className="text-gray-300 text-lg font-extralight select-none">&amp;</span>
              <a href="https://www.ag2.ai" target="_blank" rel="noopener noreferrer" title="ag2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/ag2-logo.png" alt="ag2" style={{ height: "24px", width: "auto" }} />
              </a>
            </div>

            {/* Right: nav links */}
            <nav className="flex gap-6 text-sm font-medium">
              <a href="/" className="text-gray-500 hover:text-brand transition-colors">Home</a>
              <a href="/alerts" className="text-gray-500 hover:text-brand transition-colors">Alerts</a>
            </nav>
          </div>
        </header>

        {/* No max-w here — pages manage their own containers so the hero can be full-width */}
        <main>{children}</main>

        {/* Dark footer — datap.ai style with all three brand attributions */}
        <footer style={{ background: "#252525" }} className="mt-16">
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col items-center gap-4">

            {/* Logo row */}
            <div className="flex items-center gap-6">
              {/* DataPAI — inverted white for dark bg */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/datapai-logo.png"
                alt="DataPAI"
                style={{ height: "26px", width: "auto", filter: "brightness(0) invert(1)", opacity: 0.65 }}
              />
              <span className="text-gray-600 text-xl font-extralight select-none">×</span>
              {/* TinyFish — white chip to preserve original colours */}
              <span className="bg-white rounded px-2 py-0.5 flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/tinyfish-logo.svg" alt="TinyFish" style={{ height: "18px", width: "auto" }} />
              </span>
              <span className="text-gray-600 text-xl font-extralight select-none">&amp;</span>
              {/* ag2 — white chip to preserve original colours */}
              <span className="bg-white rounded px-2 py-0.5 flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/ag2-logo.png" alt="ag2" style={{ height: "18px", width: "auto" }} />
              </span>
            </div>

            {/* Attribution text */}
            <p className="text-gray-500 text-xs text-center">
              A{" "}
              <a href="https://www.datap.ai" target="_blank" rel="noopener noreferrer" className="text-[#8fbc8f] hover:text-[#a8d5a8] transition-colors">DataPAI</a>
              {" "}project · powered by{" "}
              <a href="https://tinyfish.ai" target="_blank" rel="noopener noreferrer" className="text-[#8fbc8f] hover:text-[#a8d5a8] transition-colors">TinyFish</a>
              {" "}real-browser technology &amp;{" "}
              <a href="https://www.ag2.ai" target="_blank" rel="noopener noreferrer" className="text-[#8fbc8f] hover:text-[#a8d5a8] transition-colors">ag2</a>
              {" "}AI agent framework
            </p>
            <p className="text-gray-600 text-xs">Stock Website Change Radar — demo only. Not investment advice.</p>
          </div>
        </footer>

      </body>
    </html>
  );
}
