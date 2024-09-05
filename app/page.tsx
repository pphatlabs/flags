import { Metadata } from 'next'
import { FlagList } from './components/flags'
import { Suspense } from 'react'
export const metadata: Metadata = {
    title: 'Country Flags',
    description: 'Country Flags API and Responsive SVG Flags',
    icons: {
        icon: '/favicon.ico',
    }
}

export default function Home() {
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <FlagList/>
        </Suspense>
    )
}
