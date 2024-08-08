'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userAuthenticated } from './userAuthenticated';

function CheckAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const verifyAuthentication = () => {
            userAuthenticated().then(response => {
                setIsAuthenticated(response); // Set the authentication state
            });
        };
        verifyAuthentication();
    }, [router]);

    return isAuthenticated;
}

export default CheckAuth;
