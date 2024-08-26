'use client'
import React from 'react'
import LocationSetup from '../components/locationSetup'
import styles from '../../styles/form.module.css'

function Settings() {
    return (
        <div className={styles.container}>
            <LocationSetup></LocationSetup>
        </div>
    )
}
export default Settings