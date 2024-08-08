
import { useRouter } from 'next/navigation'
import { getCsrfToken } from '../utils/csrfToken';

export default async function logout() {
        const router = useRouter()

        const csrfToken = await getCsrfToken();
        const response = await fetch('http://localhost:8080/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRF-Token': csrfToken
            }
        })
        if (response.ok){
            router.push("/")
        }else{
            alert('Error checking authentication status')
        }
    
}