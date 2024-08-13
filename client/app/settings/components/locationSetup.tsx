'use client'
import MapComponent from '../../components/mapComponent'
import React, { useState } from 'react'
import styles from '../../../styles/login.module.css'

export const LocationSetup = () => {
    const [selectedLocationID, setSelectedLocationID] = useState<null>(null)

    function saveChanges(){

    }

    function discardChanges(){

    }

    return (
        <div>
            <form className={styles.form}>
                <div className={styles.flexColumn}>
                    <label>Selection Default Location</label>
                </div>
                <p>Select a default location instead of having to choose one every time you book a new appointment.</p>
                {/*<MapComponent inputToForm={setSelectedLocationID} />*/}


                {/*Additional details for arriving at location*/}
                <div className={styles.flexColumn}>
                    <label>Additional Location Details (optional)</label>
                </div>
                <div className={styles.inputForm}>
                    <svg xmlns="http://www.w3.org/2000/svg" width='24' height='24' viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z" /></svg>
                    <input name="locationDetails" placeholder="Describe any additional details that may help your barber get to your location" className={styles.input} type="string" />
                </div>

                {selectedLocationID && <p className={styles.pWarning}>Select a valid location to save changes</p>}

                <button className={styles.buttonSubmit} onClick={() => console.log("test")}>Save Changes</button>
                <button className={styles.buttonSubmit} onClick={() => console.log("test")}>Discard Changes</button>
            </form>
        </div>
    )
}

export default LocationSetup
