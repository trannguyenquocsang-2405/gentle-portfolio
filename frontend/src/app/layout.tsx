import './globals.css';
import { Providers } from './providers';
import NextTopLoader from 'nextjs-toploader';

export const metadata = {
  title: 'Tran Nguyen Quoc Sang',
  description: 'Portfolio of Tran Nguyen Quoc Sang',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader color="#A3B18A" showSpinner={false} />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
