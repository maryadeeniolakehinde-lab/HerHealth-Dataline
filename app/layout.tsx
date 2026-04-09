import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HerHealth Dataline - Anonymous Health Guidance for Girls',
  description:
    'Safe, anonymous health and wellness platform for girls to ask questions and get guidance from AI and expert consultants.',
  icons: {
    icon: '❤️',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ec4899" />
      </head>
      <body className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        {children}
      </body>
    </html>
  );
}
