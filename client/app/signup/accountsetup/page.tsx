'use client'
import React from 'react'
import styles from '../../../styles/form.module.css'
import LocationSetup from '@/app/settings/components/locationSetup'
import { useRouter } from 'next/navigation'
import WithAuthorization from '@/app/utils/withAuthorization'

function AccountSetup() {
    const router = useRouter()

    return (
        <WithAuthorization verificationRequired={true}>
            <div className={styles.container}>
                <div className={styles.form}>
                    <div className={styles.flexColumn}>
                        <label>Additional Account Setup (optional)</label>
                    </div>
                    <p>Optionally setup additional account details to improve your experience on CuickCut. You can later change these on your account settings page.</p>
                </div>

                <LocationSetup />

                <div className={styles.form}>
                    <button className={styles.buttonSubmit} onClick={() => router.push("/dashboard")}>Proceed to Dashboard</button>
                </div>
            </div>
        </WithAuthorization>
    )
}

export default AccountSetup
