import Link from 'next/link';
import styles from '../../styles/videoOverlay.module.css';
import NavBar from './navBar';
import bookStyle from '../../styles/bookButton.module.css'
import { useRouter } from 'next/navigation'
const VideoOverlay = () => {
    const router = useRouter()
    async function handleBookClick() {
        const response = await fetch('/api/auth/status', {
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
        <div className={styles.videoContainer}>
            <video className={styles.video} autoPlay muted loop playsInline>
                <source src='https://cuickcutstatic2005.s3.amazonaws.com/bvideo.mp4' type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className={styles.navBar}>
                <NavBar />

            </div>

            <div className={styles.overlay}>

                <Link href="/book" passHref>
                    <button onClick={handleBookClick} className={bookStyle.button}>
                        Book Now
                    </button>

                </Link>

            </div>
        </div>
    );
};

export default VideoOverlay;
