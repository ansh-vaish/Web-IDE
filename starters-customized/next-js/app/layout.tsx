import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next App",
  description: "Generated Next.js app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
