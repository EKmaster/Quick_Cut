'use client'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
    const router = useRouter()
    async function handleClick() {
        const response = await fetch('http://localhost:8080/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        })
        if (response.ok){
            router.push("/")
        }else{
            alert('Error checking authentication status')
        }
    }
    return (
        <button onClick={handleClick} >Logout</button>
    )
}