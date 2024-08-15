'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCsrfToken } from '../../utils/csrfToken'
import styles from '../../../styles/login.module.css'
import WithAuthorization from '@/app/utils/withAuthorization'

const VerifyEmail = () => {
    // TODO: check if user is logged in AND unverified before allowing on this page

    const [incorrectCode, setIncorrectCode] = useState(false)

    const router = useRouter()

    async function checkCode() {
        // if code is wrong, do nothing
        // if code is correct, send to account detail setup page

        const csrfToken = await getCsrfToken()
        const submittedCode = (document.getElementById("submit-code") as HTMLInputElement).value
        fetch("http://localhost:8080/api/auth/submitverificationcode", {
            method: "POST",
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            body: JSON.stringify({ submittedCode }),
            credentials: "include"
        }).then(response => {
            if (response.status === 404) {
                return setIncorrectCode(true)
            }
            if (response.status !== 200) {
                setIncorrectCode(false)
                return alert("There was an error submitting your code")
            }
            return response.json().then(data => {
                console.log(submittedCode)
                if (data.verified === true) {
                    // user correct submitted verification code
                    setIncorrectCode(false)
                    router.push("/signup/accountsetup")
                } else {
                    // user incorrectly submitted verification code
                    setIncorrectCode(true)
                }
            })
        })
    }

    async function sendVerificationCode() {
        fetch("http://localhost:8080/api/auth/sendverificationcode", {
            method: "GET",
            credentials: 'include'
        }).then(response => {
            if (response.status !== 200) {
                return alert("There was error in sending your verification code")
            }
            return response.json()
        }).then(data => {
            if (data.secondsUntilNewCodeSend === 0) {
                return alert("A new verification code has been sent to your email")
            } else {
                return alert("Please wait " + data.secondsUntilNewCodeSend + " seconds before attempting to send a new verification code")
            }
        })
    }

    return (
        <WithAuthorization>
            <div className={styles.container}>
                <div className={styles.form}>

                    <div className={styles.flexColumn}>
                        <label>Verify Account</label>
                    </div>
                    <p>An account verification code has been sent to your email. Please enter and submit it to verify your account.</p>
                    <div className={styles.inputForm}>
                        <svg xmlns="http://www.w3.org/2000/svg" width='24' height='24' viewBox="0 0 24 24" fill="none" stroke='#000000' strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        <input id="submit-code" placeholder="Enter verifcation code" className={styles.input} type="number" />
                    </div>

                    {incorrectCode && <p className={styles.pWarning}>Invalid verification code</p>}

                    <button className={styles.buttonSubmit} onClick={checkCode}>Send Verification Code</button>

                    <p className={styles.p}>Didn&apos;t get a code? <span className={styles.span} onClick={sendVerificationCode}>Resend</span></p>
                </div>
            </div>
        </WithAuthorization>
    )
}

export default VerifyEmail