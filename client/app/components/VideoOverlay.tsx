import Link from 'next/link';
import styles from '../../styles/videoOverlay.module.css';
import NavBar from './navBar';
import bookStyle from '../../styles/bookButton.module.css'
const VideoOverlay = () => {
  return (
    <div className={styles.videoContainer}>
      <video className={styles.video} autoPlay muted loop playsInline>
        <source src='/bvideo.mp4' type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.navBar}>
        <NavBar/>
        
      </div>
     
      <div className={styles.overlay}>
      
        <Link href="/book" passHref>
        <button className={bookStyle.button}>
  Book Now
</button>
        </Link>
      </div>
    </div>
  );
};

export default VideoOverlay;
