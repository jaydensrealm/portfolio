import type { Metadata } from "next"
import { Anton } from "next/font/google"
import "./globals.css"

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
})

export const metadata: Metadata = {
  title: "Jaydensrealm.com",
  description: "Jayden's Portfolio - Full Stack Developer",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://kit.fontawesome.com/7ec2dc835f.js"
          crossOrigin="anonymous"
          async
        />
      </head>
      <body className={anton.variable}>{children}</body>
    </html>
  )
}
