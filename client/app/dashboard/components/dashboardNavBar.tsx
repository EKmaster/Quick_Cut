"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import dashboardStyles from "../styles/dashboard.module.css"

function ProfileMenu() {
    return (
        <div style={{
            border: "1.5px solid #2d79f3",
            borderRadius: "5px",
            position: "fixed",
            backgroundColor: "#ffffff",
            padding: "5px",
            maxWidth: "200px"
        }}>
            Profile Menu: not yet implemented
        </div>
    )
}

function NotifMenu() {
    return (
        <div style={{
            border: "1.5px solid #2d79f3",
            borderRadius: "5px",
            position: "fixed",
            backgroundColor: "#ffffff",
            padding: "5px",
            maxWidth: "200px"
        }}>
            Notifications Menu: not yet implemented
        </div>
    )
}

function DashboardNavBar({ selectedPage }: { selectedPage: string }) {
    const router = useRouter()
    const [profileSelected, setProfileSelected] = useState(false)
    const [notifsSelected, setNotifsSelected] = useState(false)

    const selectProfile = () => {
        setNotifsSelected(false)
        setProfileSelected(!profileSelected)
    }

    const selectNotifs = () => {
        setProfileSelected(false)
        setNotifsSelected(!notifsSelected)
    }

    const allBookingsPressed = () => {
        router.push("/underconstruction")
    }

    const settingsPressed = () => {
        router.push("/underconstruction")
    }

    return (
        <div style={{ display: "flex", position: "fixed", zIndex: "10" }}>
            <button className={dashboardStyles.bookButton} onClick={() => router.push("/book")}>Book Now</button>

            <div style={{ width: "50px" }}></div>

            <div className={dashboardStyles.navBar}>
                <button className={dashboardStyles.navBarItem} style={{ fontWeight: selectedPage === "home" ? "bold" : "normal" }}>
                    Home
                </button>

                <button className={dashboardStyles.navBarItem}
                    style={{ fontWeight: selectedPage === "All Bookings" ? "bold" : "normal" }}
                    onClick={allBookingsPressed}>
                    All Bookings
                </button>

                <button
                    className={dashboardStyles.navBarItem}
                    style={{ fontWeight: selectedPage === "settings" ? "bold" : "normal" }}
                    onClick={settingsPressed}>
                    Settings
                </button>

                <div style={{ width: "50px" }}></div>

                <button className={dashboardStyles.navBarItem} onClick={selectProfile}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth={
                        profileSelected ? 2 : 1
                    } strokeLinecap="round" strokeLinejoin="round"><path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3" /><circle cx="12" cy="10" r="3" /><circle cx="12" cy="12" r="10" /></svg>
                    {profileSelected && <ProfileMenu />}
                </button >

                <button className={dashboardStyles.navBarItem} onClick={selectNotifs}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth={
                        notifsSelected ? 2 : 1
                    } strokeLinecap="round" strokeLinejoin="round"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path></svg>
                    {notifsSelected && <NotifMenu />}
                </button>
            </div>
        </div>
    )
}

export default DashboardNavBar