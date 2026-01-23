'use client';

import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/components/providers/AuthProvider';
// import { ThemeProvider } from 'next-themes';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Create a single instance of QueryClient for the app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// export const metadata: Metadata = {
//   title: 'Todo Application',
//   description: 'A simple todo management application',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
            <AuthProvider>
              {children}
              {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            </AuthProvider>
          {/* </ThemeProvider> */}
        </QueryClientProvider>
      </body>
    </html>
  );
}
