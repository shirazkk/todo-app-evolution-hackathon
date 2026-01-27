import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../hooks/useAuth";
import { TodosProvider } from "../context/TodosContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <TodosProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
              <Navbar />
              <main className="pt-16">
                {children}
              </main>
              <Footer />
            </div>
          </TodosProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
