import './globals.css';
import { Suspense } from 'react'; // Import Suspense

export const metadata = {
  title: 'My Wedding Invitation',
  description: 'Adryan & Alfi Wedding Invitation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<div>Loading...</div>}> {/* Tambahkan Suspense di sini */}
          {children}
        </Suspense>
      </body>
    </html>
  );
}
