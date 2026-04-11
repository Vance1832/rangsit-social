import './globals.css';
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'Rangsit Social',
  description: 'A modern university social media app.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
            <Navbar />
            <main className="container py-6 md:py-8">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
