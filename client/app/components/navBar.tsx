// components/NavBar.js
import styles from '../../styles/navBar.module.css';
import Link from 'next/link'
import Titlestyle from '../../styles/videoOverlay.module.css';
const NavBar = () => {
  return (
    <div>
         
         <strong className={`${Titlestyle.boldCursive} ${Titlestyle.title}`}>Cuick Cut</strong>
    <div className={styles.container}> 
        
    <div className={styles['button-container']}>
      <button className={styles.button} aria-label="Home">
        
        <Link href='/signup'> <p className= {styles.p}>Signup</p> </Link>
      </button>
      <button className={styles.button} aria-label="Search">
      <Link href='/login'> <p className= {styles.p}>Login</p> </Link>
      </button>
      <button className={styles.button} aria-label="Profile">
      <Link href='/'> <p className= {styles.p}>How it works</p> </Link>
      </button>
      <button className={styles.button} aria-label="Cart">
      <Link href='/'> <p className= {styles.p}>FAQs</p> </Link>
      </button>
    </div>
    </div>
    </div>
  );
};

export default NavBar;
