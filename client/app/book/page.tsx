'use client'
import React from 'react'
import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCsrfToken } from '../utils/csrfToken'
import styles from '../../styles/login.module.css'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import WithAuthentication from '../utils/withAuthentication'

function Book() {
    const router = useRouter()

    const [isLoggedIn, setIsLoggedIn] = useState(null)
    const [emptyHaircutDetails, setEmptyHaircutDetails] = useState(false)

    function getCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    function getMaxDateTime() {
        const now = new Date();
        const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const year = oneWeekFromNow.getFullYear();
        const month = String(oneWeekFromNow.getMonth() + 1).padStart(2, '0');
        const day = String(oneWeekFromNow.getDate()).padStart(2, '0');
        const hours = String(oneWeekFromNow.getHours()).padStart(2, '0');
        const minutes = String(oneWeekFromNow.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    function invalidInput(haircutDetails: string) {
        setEmptyHaircutDetails(haircutDetails === '')
        return (emptyHaircutDetails)
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        const data = {
            haircutDetails: formData.get('haircutDetails'),
            timing: formData.get('timing'),
            locationDetails: formData.get('locationDetails')
        };

        if (invalidInput(String(data.haircutDetails))) {
            return
        }

        const csrfToken = await getCsrfToken();
        const response = await fetch('http://localhost:8080/api/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });

        if (response.ok) {
            router.push('/');
        } else {
            alert('Error booking appointment');
        }
    }


    return (
        <WithAuthentication>
            <div className={styles.container}>
                <form className={styles.form} onSubmit={handleSubmit}>

                    {/*Providing haircut details*/}
                    <div className={styles.flexColumn}>
                        <label>Haircut Details</label>
                    </div>
                    <div className={styles.inputForm}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>
                        <input name="haircutDetails" placeholder="Describe your haircut" className={styles.input} type="string" />
                    </div>

                    {/*Timing Selection*/}
                    <div className={styles.flexColumn}>
                        <label>Timing</label>
                    </div>
                    <div className={styles.inputForm}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline></svg>
                        <input name="timing" className={styles.input} type="datetime-local" min={getCurrentDateTime()} max={getMaxDateTime()} />
                    </div>


                    {/*Additional details for arriving at location*/}
                    <div className={styles.flexColumn}>
                        <label>Additional Location Details (optional)</label>
                    </div>
                    <div className={styles.inputForm}>
                        <svg xmlns="http://www.w3.org/2000/svg" width='24' height='24' viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z" /></svg>
                        <input name="locationDetails" placeholder="Describe any additional details that may help your barber get to your location" className={styles.input} type="string" />
                    </div>

                    {emptyHaircutDetails && <p className={styles.pWarning}>One or more required fields are empty</p>}
                    <button className={styles.buttonSubmit} type="submit">Book</button>
                </form>
            </div>
        </WithAuthentication>
    )
}

export default Book