import { Metadata } from 'next'
import { FlagList } from './components/flags'
export const metadata: Metadata = {
    title: 'Country Flags',
    description: 'Country Flags API and Responsive SVG Flags',
    icons: {
        icon: '/favicon.ico',
    }
}

export default function Home() {
    return <FlagList/>
}
