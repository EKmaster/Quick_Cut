'use client'
import React from 'react'
import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCsrfToken } from '@/app/utils/csrfToken'
import styles from '../../../styles/form.module.css'
import WithAuthorization from '@/app/utils/withAuthorization'
import LocationSetup from '@/app/components/locationSetup'
function Book() {
    const router = useRouter()
    const [confirm, setConfirm] = useState<any>(null)
    
    
    function handleConfirmChange(event: React.ChangeEvent<HTMLInputElement>) {
        setConfirm(event.target.checked)
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        const data = {
            name: formData.get('fullName'),
            address: formData.get('address'),
            number: formData.get('mobileNumber'),
            card: formData.get('cardNumber'),
            expiry: formData.get('expirationDate'),
            id: formData.get('id'),
            resume: formData.get('resume'),
            equip: formData.get('equipment'),

        };

        

        const csrfToken = await getCsrfToken();
        if (!confirm){
            return
        }
        const response = await fetch('/api/join', {
            method: 'POST',
            headers: {
               
                'X-CSRF-Token': csrfToken,
            },
            body: formData,
            credentials: 'include'
        });

        if (response.ok) {
            router.push('/');
        } else {
            console.log(response)
            alert('Error booking appointment');
        }
    }


    return (
        <WithAuthorization verificationRequired={true}>
            <div className={styles.container}>
                <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.flexColumn}>
        <label>Full Legal Name</label>
    </div>
    <div className={styles.inputForm}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>
        <input name="fullName" placeholder="Enter your full legal name" className={styles.input} type="text" required />
    </div>

    {/* Address */}
    <div className={styles.flexColumn}>
        <label>Address</label>
    </div>
    <div className={styles.inputForm}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10.5c0 6.2-9 11.5-9 11.5s-9-5.3-9-11.5a9 9 0 0118 0z" /><circle cx="12" cy="10.5" r="3" /></svg>
        <input name="address" placeholder="Enter your address" className={styles.input} type="text" required />
    </div>

    {/* Mobile Number */}
    <div className={styles.flexColumn}>
        <label>Mobile Number</label>
    </div>
    <div className={styles.inputForm}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="18" rx="2" ry="2" /><path d="M12 17h.01" /></svg>
        <input name="mobileNumber" placeholder="Enter your mobile number" className={styles.input} type="tel" required />
    </div>

    {/* Debit/Credit Card Number */}
    <div className={styles.flexColumn}>
        <label>Debit/Credit Card Number</label>
    </div>
    <div className={styles.inputForm}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><path d="M1 10h22M7 18h.01M13 18h2" /></svg>
        <input name="cardNumber" placeholder="Enter your card number" className={styles.input} type="number" required />
    </div>

    {/* Expiration Date */}
    <div className={styles.flexColumn}>
        <label>Expiration Date</label>
    </div>
    <div className={styles.inputForm}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="18" rx="2" ry="2" /><path d="M7 7h.01M12 7h5M7 11h10M7 15h6" /></svg>
        <input
    name="expirationDate"
    placeholder="MM/YY"
    className={styles.input}
    type="text"
    pattern="(0[1-9]|1[0-2])\/?([0-9]{2})"
    title="Expiration date must be in MM/YY format"
    required
/>
    </div>

                    {/*Providing ID*/}
                    <div className={styles.flexColumn}>
                        <label>I.D</label>
                        
                    </div>
                    <input name="id" placeholder="Choose file for ID" className={styles.input} type="file" accept="image/*,.pdf"  />
                    {/*Providing Resume*/}
                    <div className={styles.flexColumn}>
                        <label>Resume</label>
                    </div>
                    <input name="resume" placeholder="Choose file for resume" className={styles.input} type="file" accept="image/*,.pdf"  />
                    
                    {/*Providing Equipment*/}
                    <div className={styles.flexColumn}>
                        <label>Picture of Equipment</label>
                    </div>
                    <input name="equipment" placeholder="Choose file for equipment" className={styles.input} type="file" accept="image/*,.pdf"  />
                    
                   

                    



                  
                    

                    

                    

                    
                    <div className={styles.flexColumn}>
                        <label>Confirmations</label>
                    </div>
                    <div className={styles.box}>
                        <input type="checkbox" id="confirm" name="confirm" value="confirm" className={styles.checkbox} onChange={handleConfirmChange} ></input>
                        I confirm I am at least 18 years old and consent to a full background check.
                    </div>
                    {!confirm && <p className={styles.pWarning}>Confirmation required</p>}
                    <button className={styles.buttonSubmit} type="submit" disabled={!confirm} >Join</button>
                </form>
            </div>
        </WithAuthorization>
    )
}

export default Book