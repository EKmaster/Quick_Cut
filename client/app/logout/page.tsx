'use client'
import { useRouter } from 'next/navigation'
 
export default function LogoutPage() {
  const router = useRouter()

  const handleClick = () => {
    localStorage.removeItem("barber_proj_token")
  }
  return (
    <button onClick = {handleClick} >Logout</button>
  )
}