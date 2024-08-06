// components/HowTo.js
import styles from '../../styles/HowTo.module.css';
import Link from 'next/link';

const HowTo = () => {
  return (
    <> 
    <div className={styles.Bcontainer}  id="how-it-works">
    <strong className={`${styles.boldCursive} ${styles.Btitle}`}>How it Works</strong>
    </div>
    <div className={styles.container}>
         
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.back}>
          <div className={styles['back-content']}>
          <img className={styles.pic} src='https://cdn-icons-png.flaticon.com/512/0/138.png' width='175px'alt="New Image" />
            <strong>Browse Barbers</strong>
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
                  <strong>Explore our list of professional barbers available in your area. Each barber has a detailed profile, including their specialties, ratings, and reviews.
                  </strong>
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

    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.back}>
          <div className={styles['back-content']}>
          <img className={styles.pic} src='https://cdn-icons-png.freepik.com/512/32/32069.png' width='175px'alt="New Image" />
            <strong>Choose Style</strong>
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
                  <strong>Select the type of haircut or grooming service you need. Our barbers offer a wide range of services to meet your specific needs.
                  </strong>
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
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.back}>
          <div className={styles['back-content']}>
          <img className={styles.pic} src='https://png.pngtree.com/png-vector/20230407/ourmid/pngtree-appointment-line-icon-vector-png-image_6677639.png' width='200px'alt="New Image" />
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
                  <strong>Pick a date and time that fits your schedule. Use our booking portal to find a slot that works for you.
                  </strong>
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
    </div>
    </>
  );
};

export default HowTo;
