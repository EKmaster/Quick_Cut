import Link from 'next/link'
import React from 'react'

function index() {
    return (
        <main>
            <h1>Welcome to Cuick Cut</h1>
            <br></br>
            <Link href='/signup/customer'> Sign Up as Customer</Link>
            <br></br>
            <Link href='/login/customer'> Login as Customer</Link>
            <br></br>
            <Link href='/book'> Book</Link>
            <br></br>
            <Link href='/view_bookings'> View Bookings</Link>
        </main>
    )
}

export default index