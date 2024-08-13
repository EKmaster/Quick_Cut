'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCsrfToken } from '../../utils/csrfToken'
import styles from '../../../styles/login.module.css'

const VerifyEmail = () => {
    // TODO: check if user is logged in AND unverified before allowing on this page

    const [incorrectCode, setIncorrectCode] = useState(false)
    const [part, setPart] = useState('Email')
    const [incorrectEmail, setIncorrectEmail] = useState(false)
    const [userEmail, setEmail] = useState('') // New state for email
    
    
    const router = useRouter()

    async function checkCode() {
        // if code is wrong, do nothing
        // if code is correct, send to account detail setup page

        const csrfToken = await getCsrfToken()
        const submittedCode = (document.getElementById("submit-code") as HTMLInputElement).value
        fetch("http://localhost:8080/api/auth/submitverificationcode?purpose=reset&email=" + String(userEmail), {
            method: "POST",
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            body: JSON.stringify({submittedCode}),
            credentials: "include"
        }).then(response => {
            if (response.status === 404){
                return setIncorrectCode(true)
            }
            if (response.status !== 200){
                setIncorrectCode(false)
                return alert("There was an error submitting your code")
            }
            return response.json().then(data => {
                console.log(submittedCode)
                if (data.verified === true){
                    // user correct submitted verification code
                    setIncorrectCode(false)
                    
                    setPart('Change')
                }else{
                    // user incorrectly submitted verification code
                    setIncorrectCode(true)
                }
            })
        })
    }

    async function sendVerificationCode(email: string) {
        
        fetch("http://localhost:8080/api/auth/sendverificationcode?purpose=reset&email=" + String(email), {
            method: "GET",
            credentials: 'include',
        }).then(response => {
            if (response.status !== 200){
                return alert("There was error in sending your verification code")
            }
            return response.json()
        }).then(data => {
            if (data.secondsUntilNewCodeSend === 0){
                return alert("A new verification code has been sent to your email")
            }else{
                return alert("Please wait " + data.secondsUntilNewCodeSend + " seconds before attempting to send a new verification code")
            }
        })
    }
    async function verifyEmail() {
        const csrfToken = await getCsrfToken()
        const email = (document.getElementById("email") as HTMLInputElement).value
        setEmail(email) // Update email state

        fetch("http://localhost:8080/api/auth/verifyemail", {
            method: "POST",
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            body: JSON.stringify({email}),
            credentials: 'include'
        }).then(async response => {
            if (response.status !== 200){
                setIncorrectEmail(true)
                return alert("No account associated with given email.")
            }
            else {
                await fetch("http://localhost:8080/api/auth/sendverificationcode?purpose=reset&email=" + String(email), {
                    method: 'GET',
                    credentials: 'include',
                })
                setPart('Code')
                
            }
            
            setIncorrectEmail(false)
            return
        })
    }
    async function changePassword() {
        const csrfToken = await getCsrfToken()
        const email = userEmail
        const password = (document.getElementById("new-password") as HTMLInputElement).value
        const response = await fetch("http://localhost:8080/api/auth/forgot-password", {
            method: "POST",
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            body: JSON.stringify({email, password}),
            credentials: 'include'
        })
        if (response.ok) {
            alert("Successfully Changed Password")
            router.push('/login')
        } else {
            alert("Error")
            // Show them response based off message
        }
        return 
    }

    return (
        <div> 
        {part === 'Code' && ( 
        <div className={styles.container}>
            <div className={styles.form}>

                <div className={styles.flexColumn}>
                    <label>Verify Account Ownership</label>
                </div>
                <p>An account verification code has been sent to this email. Please enter and submit it to verify your account ownership.</p>
                <div className={styles.inputForm}>
                    <svg xmlns="http://www.w3.org/2000/svg" width='24' height='24' viewBox="0 0 24 24" fill="none" stroke='#000000' strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <input id="submit-code" placeholder="Enter verifcation code" className={styles.input} type="number" />
                </div>

                {incorrectCode && <p className={styles.pWarning}>Invalid verification code</p>}

                <button className={styles.buttonSubmit} onClick={checkCode}>Send Verification Code</button>

                <p className={styles.p}>Didn&apos;t get a code? <span className={styles.span} onClick={sendVerificationCode}>Resend</span></p>

            </div>
        </div>
        )} 
        {part === 'Email' && ( 
        <div className={styles.container}>
            <div className={styles.form}>

                <div className={styles.flexColumn}>
                    <label>Verify Account Ownership</label>
                </div>
                <p>Enter your email.</p>
                <div className={styles.inputForm}>
                    <svg xmlns="http://www.w3.org/2000/svg" width='24' height='24' viewBox="0 0 24 24" fill="none" stroke='#000000' strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <input id="email" placeholder="Enter email" className={styles.input} type="email" />
                </div>

                {incorrectEmail && <p className={styles.pWarning}>No account associated with given email.</p>}

                <button className={styles.buttonSubmit} onClick={verifyEmail}>Verify Email</button>
            </div>
        </div>
         )} 
        {part === 'Change' && ( 
        <div className={styles.container}>
                                <div className={styles.form}>
                                    <div className={styles.flexColumn}>
                                        <label>Change Password</label>
                                    </div>
                                    <div className={styles.inputForm}>
                                        <input id="new-password" placeholder="Enter new password" className={styles.input} type="password" />
                                    </div>
                                    <button className={styles.buttonSubmit} onClick={changePassword}>Change Password</button>
                                </div>
                            </div>
                            )} 
    </div>
    )
}

export default VerifyEmail