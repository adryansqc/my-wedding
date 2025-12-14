import './globals.css';
import { Suspense } from 'react';

export const metadata = {
  title: 'Wedding Invitation Alfi & Adryan',
  description: 'Alfi & Adryan Wedding Invitation',
  icons: {
    icon: '/images/cover.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-pink-50">
            <h1 className="text-4xl sm:text-6xl font-serif font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 animate-pulse">
              Wedding Invitation
            </h1>
          </div>
        }>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
