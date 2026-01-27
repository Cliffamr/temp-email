import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TempMail - Free Temporary Email Service",
  description: "Create instant disposable email addresses. Receive emails in real-time. No registration required. Perfect for testing and privacy.",
  keywords: ["temporary email", "disposable email", "temp mail", "anonymous email", "test email"],
  authors: [{ name: "TempMail" }],
  openGraph: {
    title: "TempMail - Free Temporary Email Service",
    description: "Create instant disposable email addresses. Receive emails in real-time.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
