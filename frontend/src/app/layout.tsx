import './globals.css';
import { Providers } from './providers';

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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
