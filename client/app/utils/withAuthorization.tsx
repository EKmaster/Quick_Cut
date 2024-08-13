'use client'
import {useEffect, useState, ReactNode} from 'react'
import { useRouter } from 'next/navigation'
import { userAuthenticated } from './userAuthenticated'
import {userVerified} from './userVerified'

function WithAuthorization({children, verificationRequired = false}: {children: ReactNode, verificationRequired?: boolean}) {
    const [authorized, setAuthorized] = useState<boolean | null>(null)
    const router = useRouter()
    useEffect(() => {
        const verifyAuthorization = async () => {
            const loggedIn = await userAuthenticated()
            if (loggedIn) {
                if (verificationRequired){
                    const v = await userVerified()
                    if (v){
                        setAuthorized(true)
                    }else{
                        await fetch("http://localhost:8080/api/auth/sendverificationcode", {
                            method: 'GET',
                            credentials: 'include'
                        })
                        router.push('/signup/verifyemail')
                    }
                }else{
                    setAuthorized(true)
                }
            } else {
                router.push('/login'); // Redirect to login page if not authenticated
            }
        }
        verifyAuthorization()
    }, [router])

    if (authorized === null) {
        return <div></div>; // add some sort of loading screen later here
    }
    return (
        <div>{children}</div>
    )
}

export default WithAuthorization