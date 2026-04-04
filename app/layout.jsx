import "@/styles/globals.css";

import { Inter } from "next/font/google";
import Nav from "@/components/Nav";
import Provider from "@/components/Provider";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Promptopia",
  description: "Discover & Share AI Prompts",
};

const RootLayout = ({ children }) => (
  <html lang='en' className={inter.className}>
    <body suppressHydrationWarning>
      <Provider>
        <div className='main'>
          <div className='gradient' />
        </div>

        <main className='app'>
          <Nav />
          {children}
        </main>
      </Provider>
    </body>
  </html>
);

export default RootLayout;