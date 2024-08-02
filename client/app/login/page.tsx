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
      console.log('CSRF Token from API:', data.csrfToken);

      return data.csrfToken;
  };
  
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')
    const csrfToken = await getCsrfToken();

    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken, // Include the CSRF token in the headers
    },

      body: JSON.stringify({ email, password }),
      credentials: 'include', // Ensure cookies are included

    })
 
    if (response.ok) {
      //const data = await response.json();
      //localStorage.setItem('barber_proj_token', data.token);
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