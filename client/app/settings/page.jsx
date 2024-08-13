'use client'
import React from 'react'
import LocatonSetup from './components/locationSetup'
import styles from '../../styles/login.module.css'

export const Settings = () => {
  return (
    <div className={styles.container}>
        <LocatonSetup></LocatonSetup>
    </div>
  )
}

export default Settings