import type { Metadata, Viewport } from "next"
import Script from "next/script"
import "./globals.css"

export const metadata: Metadata = {
  title: "Jayden | Full Stack Developer",
  description: "Full Stack Developer based in Nashville, TN. Specializing in Java, Python, Rust, React, and cloud architecture.",
  keywords: ["Full Stack Developer", "Software Engineer", "Nashville", "Java", "React", "AWS"],
  authors: [{ name: "Jayden" }],
  openGraph: {
    title: "Jayden | Full Stack Developer",
    description: "Full Stack Developer based in Nashville, TN.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#1d1d1d",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://kit.fontawesome.com/7ec2dc835f.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
