import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Design Alignment Contract',
  description: 'Turn vague client input into a binding design direction — before the project starts.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
