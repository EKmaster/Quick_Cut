'use client'
import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation'

function index() {
    const router = useRouter()
    function getCookie(name: string): string | undefined {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return undefined;
    }
    
  async function handleBookClick() {
    const response = await fetch('http://localhost:8080/api/auth/status', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${token}`, // Include the JWT token in the headers
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
            <h1>Welcome to Cuick Cut</h1>
            <br></br>
            <Link href='/signup'> Sign Up as Customer</Link>
            <br></br>
            <Link href='/login'> Login as Customer</Link>
            <br></br>
            <button onClick={handleBookClick}>Book</button>
            <br></br>
            <Link href='/view_bookings'> View Bookings</Link>
        </main>
    )
}

export default index