// components/HowTo.js
import styles from '../../styles/HowTo.module.css';
import Link from 'next/link';

const HowTo = () => {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.back}>
          <div className={styles['back-content']}>
          <img src='/point.png' width='340px'alt="New Image" />
            <strong>Book</strong>
          </div>
        </div>
        <div className={styles.front}>
          <div className={styles.img}>
            <div className={styles.circle}></div>
            <div className={`${styles.circle} ${styles.right}`}></div>
            <div className={`${styles.circle} ${styles.bottom}`}></div>
          </div>
          <div className={styles['front-content']}>
           
            <div className={styles.description}>
              <div className={styles.title}>
                <p className={styles.title}>
                  <strong>Book online in a just a few clicks!</strong>
                </p>
                <svg
                  fill="#20c997"
                  height="15px"
                  width="15px"
                  viewBox="0 0 256 256"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M25,27l-9,-6.75l-9,6.75v-23h18z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowTo;
