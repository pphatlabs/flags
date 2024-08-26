import { Metadata } from 'next'
import './styles/app.css'

export const metadata: Metadata = {
    title: 'Country Flags',
    description: 'Country Flags API and Responsive SVG Flags',
    icons: {
        icon: '/favicon.ico',
    }
}


export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
