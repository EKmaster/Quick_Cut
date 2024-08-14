// components/HowTo.js
'use client'
import { useEffect, useRef } from 'react';
import styles from '../../styles/HowTo.module.css';
import Link from 'next/link';

const HowTo = () => {
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    



    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    
                    if (entry.isIntersecting) {
                        console.log(entry)
                        entry.target.classList.add(styles.show);
                        
                    }
                });
            },
            {
                root: null, // Default is the viewport
                rootMargin: '0px',
                threshold: 0.1 // Trigger when 10% of the element is visible
            }
        );

        itemRefs.current.forEach((ref) => {
            if (ref) {
                observer.observe(ref);
            }
        });


        return () => {
            itemRefs.current.forEach((ref) => {
                if (ref) {
                    observer.unobserve(ref);
                }
            });
        };
    }, []);


    
    return (
        <>
            <div className={`${styles.Bcontainer} `} id="how-it-works">
            <div ref={(el) => { itemRefs.current[0] = el; }} className={styles.hidden}>
            <strong className={`${styles.boldCursive} ${styles.Btitle}`}>How it Works</strong>
            </div>
            </div>
            <div className={styles.container}>
                
            <div ref={(el) => { itemRefs.current[1] = el; }} className={styles.hidden}>
                <div className={styles.card}>
                
                    <div className={styles.content}>
                        <div className={styles.back}>
                            <div className={styles['back-content']}>
                                <img className={styles.pic} src='https://cdn-icons-png.flaticon.com/512/0/138.png' width='175px' alt="New Image" />
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
                </div>
                <div ref={(el) => { itemRefs.current[2] = el; }} className={styles.hidden}>
                <div className={styles.card}>
                
                    <div className={styles.content}>
                        <div className={styles.back}>
                            <div className={styles['back-content']}>
                                <img className={styles.pic} src='https://cdn-icons-png.freepik.com/512/32/32069.png' width='175px' alt="New Image" />
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
                </div>
                <div ref={(el) => { itemRefs.current[3] = el; }} className={styles.hidden}>
                
                <div className={styles.card}>
                
                    <div className={styles.content}>
                        <div className={styles.back}>
                            <div className={styles['back-content']}>
                                <img className={styles.pic} src='https://png.pngtree.com/png-vector/20230407/ourmid/pngtree-appointment-line-icon-vector-png-image_6677639.png' width='200px' alt="New Image" />
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
            </div>
            
        </>
    );
};

export default HowTo;
