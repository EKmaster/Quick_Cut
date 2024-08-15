'use client'
import MapComponent from '../../components/mapComponent'
import React, { FormEvent, useState } from 'react'
import { getCsrfToken } from '@/app/utils/csrfToken'
import styles from '../../../styles/login.module.css'

export const LocationSetup = () => {
    const [selectedLocationID, setSelectedLocationID] = useState<null>(null)
    const [emptyLocationSelection, setEmptyLocationSelection] = useState(false)

    function validateInput(){
        if (selectedLocationID === null){
            setEmptyLocationSelection(true)
            return false
        }
        setEmptyLocationSelection(false)
        return true
    }

    async function saveChanges(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const locationDetails = new FormData(event.currentTarget).get("locationDetails")
        if (!validateInput()){
            return
        }

        // updating default location details in database
        const csrfToken = await getCsrfToken()
        const response = await fetch("http://localhost:8080/api/settings/setdefaultlocation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken,
            },
            body: JSON.stringify({googlePlacesID: selectedLocationID, additionalDetails: locationDetails}),
            credentials: "include"
        })
        if (response.ok){
            alert("Default location sucessfully updated")
        }else{
            alert("There was an error setting your location details")
        }

    }

    return (
        <div>
            <form className={styles.form} onSubmit={saveChanges}>
                <div className={styles.flexColumn}>
                    <label>Selection Default Location</label>
                </div>
                <p>You may select a default location instead of choosing one each time you book.</p>
                <MapComponent inputToForm={setSelectedLocationID} />

                {/*Additional details for arriving at location*/}
                <div className={styles.flexColumn}>
                    <label>Additional Location Details (optional)</label>
                </div>
                <div className={styles.inputForm}>
                    <svg xmlns="http://www.w3.org/2000/svg" width='24' height='24' viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z" /></svg>
                    <input name="locationDetails" placeholder="Describe any additional details that may help your barber get to your location" className={styles.input} type="string" />
                </div>

                {emptyLocationSelection && <p className={styles.pWarning}>Select a valid location to save changes</p>}

                <button type="submit" className={styles.buttonSubmit}>Save Changes</button>
            </form>
        </div>
    )
}

export default LocationSetup
