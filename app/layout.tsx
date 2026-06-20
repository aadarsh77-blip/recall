import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title: 'Recall — AI Knowledge OS',
  description: 'Your institutional knowledge, queryable in plain English. Powered by AI and Aurora PostgreSQL with pgvector.',
  keywords: ['knowledge management', 'AI', 'semantic search', 'RAG', 'note taking'],
  openGraph: {
    title: 'Recall — AI Knowledge OS',
    description: 'Ask your notes anything. Discover hidden connections. Never lose an idea.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
                  document.documentElement.setAttribute('data-theme', 'light');
                } else {
                  document.documentElement.removeAttribute('data-theme');
                }
              } catch (_) {}
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
