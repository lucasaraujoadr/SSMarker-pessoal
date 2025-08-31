import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Social Media Maker - Crie artes em minutos',
  description: 'Plataforma para criar artes de social media em minutos com templates inteligentes, variações automáticas e exportação em alta qualidade.',
  keywords: 'social media, design, templates, instagram, facebook, marketing digital',
  authors: [{ name: 'Social Media Maker' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Social Media Maker - Crie artes em minutos',
    description: 'Plataforma para criar artes de social media em minutos com templates inteligentes, variações automáticas e exportação em alta qualidade.',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Social Media Maker - Crie artes em minutos',
    description: 'Plataforma para criar artes de social media em minutos com templates inteligentes, variações automáticas e exportação em alta qualidade.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@300;400;600;700&family=Montserrat:wght@300;400;500;600;700&family=Source+Sans+Pro:wght@300;400;600&family=Nunito:wght@300;400;500;600;700&family=Work+Sans:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700&family=Lora:wght@400;500;600;700&family=Source+Serif+Pro:wght@300;400;600;700&family=Crimson+Text:wght@400;600;700&family=Libre+Baskerville:wght@400;700&family=JetBrains+Mono:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500;600;700&family=Source+Code+Pro:wght@300;400;500;600;700&family=Roboto+Mono:wght@300;400;500;600;700&family=Inconsolata:wght@300;400;500;600;700;800;900&family=Cousine:wght@400;700&family=Ubuntu+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
