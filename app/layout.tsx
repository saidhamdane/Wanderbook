import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wanderbook · Your trip, your story, your magazine',
  description:
    'Wanderbook turns your trip photos into a printable, magazine-quality family travel keepsake.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
