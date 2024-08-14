'use client'
import React from 'react'
import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCsrfToken } from '../utils/csrfToken'
import styles from '../../styles/login.module.css'
import WithAuthorization from '../utils/withAuthorization'
import MapComponent from '../components/mapComponent'

function Book() {
    const router = useRouter()

    const [isLoggedIn, setIsLoggedIn] = useState(null)
    const [emptyFields, setEmptyFields] = useState({
        haircutDetails: false,
        timing: false,
        location: false,
    });


    const [selectedLocationID, setSelectedLocationID] = useState<null>(null)
    const [price, setPrice] = useState(40)
    const [isBeardTrimSelected, setIsBeardTrimSelected] = useState(false);

    type ServiceType = 'haircut' | 'buzz' | 'fade' | 'shave';

    const servicePrices: Record<ServiceType, number> = {
        haircut: 20,
        buzz: 15,
        fade: 25,
        shave: 7
    };

    function handleServiceChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectedService: ServiceType = event.target.value as ServiceType;
        let basePrice = servicePrices[selectedService];

        if (isBeardTrimSelected) {
            basePrice += 15; // Add beard trim price if selected
        }
        
        setPrice(basePrice + 20);
    

    }
    function handleBeardChange(event: React.ChangeEvent<HTMLInputElement>) {

        const isChecked = event.target.checked;
    setIsBeardTrimSelected(isChecked);

    const selectedService = (document.getElementById('service') as HTMLSelectElement).value as keyof typeof servicePrices;
    let basePrice = servicePrices[selectedService];
    
    if (isChecked) {
        basePrice += 15; // Add beard trim price if checked
    }
    
    setPrice(basePrice + 20);



    }

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

    function validateInputs(haircutDetails: string, timing: string, location: any) {
        setEmptyFields({
            haircutDetails: haircutDetails.trim() === '',
            timing: timing.trim() === '',
            location: location === null
        });
        return haircutDetails.trim() !== '' && timing.trim() !== '' && location !== null;
    }


    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        const haircutDetails = String(formData.get('haircutDetails'));
        const timing = String(formData.get('timing'));
        const locationDetails = formData.get('locationDetails');

        const data = {
            service: formData.get('service'),
            beard: isBeardTrimSelected,
            haircutDetails: formData.get('haircutDetails'),
            timing: formData.get('timing'),
            locationGooglePlacesID: selectedLocationID,
            locationDetails: formData.get('locationDetails'),
            
        };

        console.log(data)

        if (!validateInputs(haircutDetails, timing, selectedLocationID)) {
            return;
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
        <WithAuthorization verificationRequired={true}>
            <div className={styles.container}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    {/*Providing service*/}
                    <div className={styles.flexColumn}>
                        <label>Service</label>
                    </div>
                    <select name="service" id="service" className={styles.input} onChange={handleServiceChange}>
                        
                        <option value="haircut">Haircut $20</option>
                        <option value="buzz">Buzz Cut $15</option>
                        <option value="fade">Fade $25</option>
                        <option value="shave">Head Shave $7</option>
                    </select>
                    {/*Providing beard trim*/}
                    <div className={styles.flexColumn} >
                    <input type="checkbox" id="beard" name="beard" value="beard" className={styles.checkbox} onChange={handleBeardChange}></input>
                        <label>Beard Trim $15</label>
                    </div>
                    
                    {/*Providing beard cut option*/}
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

                    {/*Google maps API integration*/}
                    <MapComponent inputToForm={setSelectedLocationID}/>

                    {/*Additional details for arriving at location*/}
                    <div className={styles.flexColumn}>
                        <label>Additional Location Details (optional)</label>
                    </div>
                    <div className={styles.inputForm}>
                        <svg xmlns="http://www.w3.org/2000/svg" width='24' height='24' viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z" /></svg>
                        <input name="locationDetails" placeholder="Describe any additional details that may help your barber get to your location" className={styles.input} type="string" />
                    </div>

                    {emptyFields.haircutDetails && <p className={styles.pWarning}>Haircut details are required</p>}
                    {emptyFields.timing && <p className={styles.pWarning}>Timing is required</p>}
                    {emptyFields.location && <p className={styles.pWarning}>Location is required</p>}
                    <div className={styles.flexColumn}>
                        <label>Price: ${price}</label>
                    </div>
                    <button className={styles.buttonSubmit} type="submit">Book</button>
                </form>
            </div>
        </WithAuthorization>
    )
}

export default Book