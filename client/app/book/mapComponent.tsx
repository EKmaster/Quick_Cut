import React, { useState, useCallback } from 'react';
import Script from 'next/script'
import Head from 'next/head';
import styles from '../../styles/login.module.css'

const libraries = ["places"]

function MapComponent() {


    const handleMapClick = () => {

    }

    return (
        <>
            <div className={styles.inputForm}>
                <svg xmlns="http://www.w3.org/2000/svg" width='24' height='24' viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z" /></svg>


                <input name="location"
                    placeholder="Search"
                    className={styles.input} type="string"
                />
            </div>
        </>
    );
}

export default MapComponent