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
        <div> 
        <div className={styles.bannerContainer}>
            <img src ="/join.jpg" className={styles.picture}/>
                
            
            <div className={styles.navBar}>
                <NavBar />

            </div>

            <div className={styles.overlay}>

                
                <strong className={` ${styles.Btitle}`}>Cut when you want, where you want </strong>
                <strong className={` ${styles.Btitle}`}> </strong>

                

            </div>
        </div>
        <div className={styles.titleText}> <strong >Why Join</strong>  </div>
        <div className={styles.container}>
            <div> 
                <img  width='100px' className={styles.iconPic} src ="/timer.png" />
                <strong className={styles.points}>Set your own schedule</strong> 
                <p>
                Enjoy the freedom to choose your work hours.
                </p>
                <p> You can create a schedule that fits </p>
                <p>
                your lifestyle and personal commitments.
                </p>
            </div>
            <div> 
                <img  width='90px' className={styles.iconPic} src ="/money.png" />
                <strong className={styles.points}>Earn more faster</strong> 
                <p>
                    Register and be approved within days.
                    
                </p>
                <p>
                    Start cutting and have your earnings automatically
                    
                </p>
                <p>
                     transfer into your bank account every week. 
                    
                </p>
            </div>
            <div> 
                <img  width='90px' className={styles.iconPic} src ="/customer.png" />
                <strong className={styles.points}>Expand your customer base</strong> 
                <p>
                Tap into a larger pool of potential clients.
                    
                </p>
                <p>
                Form loyal customers.
                    
                </p>
                <p>
                Grow your personal brand beyond your local area. 
                    
                </p>
            </div>
                
            </div>
            <div className={styles.bannerContainer}>
            <img src ="/join.jpg" className={styles.picture}/>
                
            
           

            <div className={styles.overlay}>

                
            <div className={styles.titleText}> <strong >What you need</strong>  </div>

                

            </div>
        </div>
            <div className={styles.container}>
            <div> 
                <img  width='90px' className={styles.iconPic} src ="/req.png" />
                <strong className={styles.points}>Requirements</strong> 
                <p>
                At least 18 years old.
                </p>
                <p> Atleast 2 years of past experience </p>
                <p>
                Pass a Bacground Check.
                </p>
            </div>
            <div> 
                <img  width='85px' className={styles.iconPic} src ="/doc.png" />
                <strong className={styles.points}>Documentation</strong> 
                <p>
                Valid barber licencse
                    
                </p>
                <p>
                Proof of identity and address.
                    
                </p>
                <p>
                Bank account details for weekly payments.
                    
                </p>
                <p>
                Resume for past experience
                    
                </p>
            </div>
            <div> 
                <img  width='100px' className={styles.iconPic} src ="/equip.png" />
                <strong className={styles.points}>Equipment</strong> 
                <p>
                Professional-grade and portable
                    
                </p>
                <p>
                barber tools and supplies.
                </p>
                <p>
                Reliable transportation for traveling.
                    
                </p>
                
            </div>
                
            </div>
        </div>
        
        
    );
};

export default apply;
