'use client'
import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation'

import VideoOverlay from './components/VideoOverlay';
import HowTo from './components/HowTo';
import FAQ from './components/FAQ'
function Index() {
    const router = useRouter()
    async function handleBookClick() {
        const response = await fetch('/api/auth/status', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
        if (response.ok) {
            router.push('/book')

        } else {
            router.push('/login')
            alert('Error checking authentication status')
        }
    }

    return (
        <main>
            <VideoOverlay />
            <HowTo />
            <FAQ />
        </main>
    )
}

export default Index