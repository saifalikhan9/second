import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { DM_Sans, Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';

import './globals.css';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' });

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        'antialiased',
        fontMono.variable,
        'font-sans',
        dmSans.variable,
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
      <Script
        strategy="afterInteractive"
        src=" https://platform.twitter.com/widgets.js"
      />
    </html>
  );
}
