'use client'
import Link from 'next/link';
import styles from '../../styles/bannerPic.module.css';
import NavBar from '../components/navBar'
import bookStyle from '../../styles/bookButton.module.css'
import { useRouter } from 'next/navigation'
const apply = () => {
    const router = useRouter()
    async function handleBookClick() {
        const response = await fetch('http://localhost:8080/api/auth/status', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
        if (response.ok) {
            router.push('/book')

        } else {
            router.push('/login')
        }
    }
    return (
        <div className={styles.bannerContainer}>
            <img src ="/join.jpg" className={styles.picture}/>
                
            
            <div className={styles.navBar}>
                <NavBar />

            </div>

            <div className={styles.overlay}>

                <Link href="/book" passHref>
                <strong className={`${styles.boldCursive} ${styles.Btitle}`}>Join as a Barber</strong>

                </Link>

            </div>
        </div>
    );
};

export default apply;
