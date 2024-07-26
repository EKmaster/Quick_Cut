'use client'
import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation'

function index() {
    const router = useRouter()

  async function handleBookClick() {
    const response = await fetch('http://localhost:8080/api/auth/status', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache': 'no-cache'
      },
      credentials: 'include' 
    })

    if (response.ok) {
        router.push('/book')
      
    } else {
        router.push('/login/customer')
      alert('Error checking authentication status')
    }
  }

    return (
        
        <main>
            <h1>Welcome to Cuick Cut</h1>
            <br></br>
            <Link href='/signup/customer'> Sign Up as Customer</Link>
            <br></br>
            <Link href='/login/customer'> Login as Customer</Link>
            <br></br>
            <button onClick={handleBookClick}>Book</button>
            <br></br>
            <Link href='/view_bookings'> View Bookings</Link>
        </main>
    )
}

export default index