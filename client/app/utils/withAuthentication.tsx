'use client'
import {useEffect, useState, ReactNode} from 'react'
import { useRouter } from 'next/navigation'
import { userAuthenticated } from './userAuthenticated'


function WithAuthentication({children}: {children: ReactNode}) {
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
    const router = useRouter()
    useEffect(() => {
        const verifyAuthentication = async () => {
            const response = await userAuthenticated()
            if (response) {
                setLoggedIn(true);
            } else {
                router.push('/login'); // Redirect to login page if not authenticated
            }
            setLoggedIn(response)
        }
        verifyAuthentication()
    }, [router])

    if (loggedIn === null) {
        return <div></div>; // You can customize this with a spinner or loading message
    }

    return (
        <div>{loggedIn ? children : <div></div>}</div>
    )
}

export default WithAuthentication