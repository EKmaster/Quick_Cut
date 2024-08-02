'use client'
import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { getCsrfToken } from '../utils/csrfToken'

export default function LoginPage() {
    const router = useRouter()

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const email = formData.get('email')
        const password = formData.get('password')
        const csrfToken = await getCsrfToken(); 

        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },

            body: JSON.stringify({ email, password }),
            credentials: 'include',
        })

        if (response.ok) {
            router.push('/')
        } else {
            alert("Error")
            // Show them response based off message
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    )
}