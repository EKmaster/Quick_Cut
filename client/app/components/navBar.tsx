// components/NavBar.js
import styles from '../../styles/navBar.module.css';
import Link from 'next/link'
import Titlestyle from '../../styles/videoOverlay.module.css';
import { userAuthenticated } from '../utils/userAuthenticated';
import { getCsrfToken } from '../utils/csrfToken';
import { useEffect, useState } from 'react';
const NavBar =  () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const checkAuthentication = () => {
            userAuthenticated().then(response => {
                setIsAuthenticated(response)
            })
        }
        checkAuthentication()
    }, [])

    async function logout() {


        const csrfToken = await getCsrfToken();
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRF-Token': csrfToken
            }
        })
        if (response.ok) {
            window.location.reload();
        } else {
            alert('Error checking authentication status')
        }

    }
    return (
        <div>
            <strong className={`${Titlestyle.boldCursive} ${Titlestyle.title}`}>
            <Link href='/'> Cuick Cut </Link>
            </strong>
            <div className={styles.container}>
                <div className={styles['button-container']}>
                    {isAuthenticated ? (
                        <>
                            <button className={styles.button} onClick={logout} aria-label="Logout">
                                <p className={styles.p}>Logout</p>
                            </button>
                            <button className={styles.button} aria-label="Dashboard">
                                <Link href='/'> <p className={styles.p}>Dashboard</p> </Link>
                            </button>
                        </>
                    ) : (
                        <>
                            <button className={styles.button} aria-label="Signup">
                                <Link href='/signup'> <p className={styles.p}>Signup</p> </Link>
                            </button>
                            <button className={styles.button} aria-label="Login">
                                <Link href='/login'> <p className={styles.p}>Login</p> </Link>
                            </button>
                        </>
                    )}
                    <button className={styles.button} aria-label="How it works">
                        <a href='#how-it-works'> <p className={`${styles.p}`}>How it works</p> </a>
                    </button>
                    <button className={styles.button} aria-label="FAQs">
                        <a href='#faqs'> <p className={`${styles.p}`}>FAQs</p> </a>
                    </button>
                    <button className={styles.button} aria-label="Join as a Barber">
                                <Link href='/join'> <p className={styles.p}>Join as a Barber</p> </Link>
                            </button>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
