import React from 'react';
import styles from '../../styles/faq.module.css';

const FAQ = () => {
    return (
        <>
            <div className={styles.Bcontainer} id="faqs">
                <strong className={`${styles.boldCursive} ${styles.Btitle}`}>FAQs</strong>
            </div>
            <div className={styles.container}>
                <div className={styles.faq}>
                    <input id='faq-a' type='checkbox' className={styles.checkbox} />
                    <label htmlFor='faq-a' className={styles.label}>
                        <p className={styles['faq-heading']}>How does payment work?</p>
                        <div className={styles['faq-arrow']}></div>
                        <p className={styles['faq-text']}>You pay once we connect you with a barber. </p>
                    </label>
                    <input id='faq-b' type='checkbox' className={styles.checkbox} />
                    <label htmlFor='faq-b' className={styles.label}>
                        <p className={styles['faq-heading']}>How long does it take for the barber to arrive?</p>
                        <div className={styles['faq-arrow']}></div>
                        <p className={styles['faq-text']}>Depending on how far they live, <strong>10 to 30 minutes</strong> .</p>
                    </label>
                    <input id='faq-c' type='checkbox' className={styles.checkbox} />
                    <label htmlFor='faq-c' className={styles.label}>
                        <p className={styles['faq-heading']}>What is your refund policy? </p>
                        <div className={styles['faq-arrow']}></div>
                        <p className={styles['faq-text']}>If the refund reason is accepted, full refund will be given.</p>
                    </label>
                    <input id='faq-d' type='checkbox' className={styles.checkbox} />
                    <label htmlFor='faq-d' className={styles.label}>
                        <p className={styles['faq-heading']}>Will the barber know my style? </p>
                        <div className={styles['faq-arrow']}></div>
                        <p className={styles['faq-text']}>The barber assigned to your cut will be an <strong>expert </strong> in your chosen style.</p>
                    </label>
                    <input id='faq-e' type='checkbox' className={styles.checkbox} />
                    <label htmlFor='faq-e' className={styles.label}>
                        <p className={styles['faq-heading']}>How do I become a barber with Cuick Cut</p>
                        <div className={styles['faq-arrow']}></div>
                        <p className={styles['faq-text']}>Send an application through our website!</p>
                    </label>
                </div>
            </div>
        </>
    );
};

export default FAQ;
