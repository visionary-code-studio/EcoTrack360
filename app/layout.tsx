import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EcoTrack360 — Measure. Understand. Reduce. Sustain.',
  description: 'EcoTrack360 is a carbon footprint awareness platform that helps you understand your daily environmental impact and take personalized action to reduce emissions.',
  keywords: 'carbon footprint, sustainability, eco tracker, climate action, carbon calculator, green living',
  openGraph: {
    title: 'EcoTrack360',
    description: 'Track, understand, and reduce your carbon footprint with personalized AI-powered insights.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
