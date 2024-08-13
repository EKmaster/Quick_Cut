'use client'
import {useEffect, useState, ReactNode} from 'react'
import { useRouter } from 'next/navigation'
import { userAuthenticated } from './userAuthenticated'


function WithAuthentication({children, verificationRequired = false}: {children: ReactNode, verificationRequired?: boolean}) {
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null)
    const [verified, setVerified] = useState<boolean  | null>(null)
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
        return <div></div>; // add some sort of loading screen later here
    }
    return (
        <div>{loggedIn ? children : <div></div>}</div>
    )
}

export default WithAuthentication