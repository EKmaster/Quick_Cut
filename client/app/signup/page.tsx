'use client'
import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
 
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const getCsrfToken = async () => {
      const response = await fetch('http://localhost:8080/api/csrf-token', {
          credentials: 'include',
      });
      const data = await response.json();
      return data.csrfToken;
  };
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')
    const firstName = formData.get('firstName')
    const lastName = formData.get('lastName')
    const csrfToken = await getCsrfToken();
 
    const response = await fetch('http://localhost:8080/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken},
      body: JSON.stringify({ email, password, firstName, lastName }),
      credentials: 'include'
    })
 
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('barber_proj_token', data.token); // Store the JWT token
      router.push('/')
    } else {
      // Show them response based off message
    }
  }
 
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <input type="firstName" name="firstName" placeholder="First Name" required />
      <input type="lastName" name="lastName" placeholder="Last Name" required />
      <button type="submit">Sign up</button>
    </form>
  )
}