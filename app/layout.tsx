import type { Metadata } from "next";
import { Poppins, Rajdhani } from "next/font/google";
import Image from "next/image";
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
  title: "DataP.ai × TinyFish | Website Change Intelligence",
  description: "TinyFish scans company websites. DataP.ai converts wording changes into financial signals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${rajdhani.variable}`}>
      <body className="min-h-screen bg-[#fcfcfd] text-[#252525] antialiased">

        {/* Navbar */}
        <header className="bg-white border-b border-gray-100" style={{ boxShadow: "0 2px 10px rgba(0,0,0,.06)" }}>
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

            {/* Left: TinyFish logo powered by DataP.ai */}
            <div className="flex items-center gap-3">
              <a href="https://tinyfish.ai" target="_blank" rel="noopener noreferrer" title="TinyFish">
                <Image
                  src="/logos/tinyfish.svg"
                  width={100}
                  height={28}
                  alt="TinyFish"
                  style={{ height: "28px", width: "auto" }}
                />
              </a>
              <span className="text-gray-400 text-xs font-medium">powered by</span>
              <a href="https://www.datap.ai" target="_blank" rel="noopener noreferrer" title="DataP.ai">
                <Image
                  src="/logos/datapai.svg"
                  width={100}
                  height={28}
                  alt="DataP.ai"
                  style={{ height: "26px", width: "auto" }}
                />
              </a>
            </div>

            {/* Right: nav links */}
            <nav className="flex gap-6 text-sm font-medium">
              <a href="/" className="text-gray-500 hover:text-brand transition-colors">Home</a>
              <a href="/alerts" className="text-gray-500 hover:text-brand transition-colors">Alerts</a>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        {/* Footer */}
        <footer style={{ background: "#252525" }} className="mt-16">
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="bg-white rounded px-2 py-0.5 flex items-center">
                <Image src="/logos/tinyfish.svg" width={80} height={18} alt="TinyFish" style={{ height: "18px", width: "auto" }} />
              </span>
              <span className="text-gray-600 text-lg font-extralight select-none">×</span>
              <Image
                src="/logos/datapai.svg"
                width={80}
                height={22}
                alt="DataP.ai"
                style={{ height: "22px", width: "auto", filter: "brightness(0) invert(1)", opacity: 0.65 }}
              />
            </div>
            <p className="text-gray-500 text-xs text-center">
              A{" "}
              <a href="https://www.datap.ai" target="_blank" rel="noopener noreferrer" className="text-[#8fbc8f] hover:text-[#a8d5a8] transition-colors">DataP.ai</a>
              {" "}project · powered by{" "}
              <a href="https://tinyfish.ai" target="_blank" rel="noopener noreferrer" className="text-[#8fbc8f] hover:text-[#a8d5a8] transition-colors">TinyFish</a>
              {" "}real-browser technology
            </p>
            <p className="text-gray-600 text-xs">Website Change Intelligence — demo only. Not investment advice.</p>
          </div>
        </footer>

      </body>
    </html>
  );
}
