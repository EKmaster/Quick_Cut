"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import WithAuthorization from '../utils/withAuthorization'
import DashboardNavBar from './components/dashboardNavBar'
import dashboardStyles from './styles/dashboard.module.css'
import ActiveBookings from './components/activeBookings'
import PastBookings from './components/pastBookings'

interface UserInformationType {
    username: string | null,
    fullName: string | null,
    activeBookings: {
        id: string,
        time: Date,
        status: string,
        description: string
    }[] | null,
    pastBookings: {
        id: string,
        time: Date,
        status: string,
        description: string
    }[] | null
}

function AccountDashboard() {
    const router = useRouter()

    const [userInformation, setUserInformation] = useState<UserInformationType>({
        username: "user829",
        fullName: "Joe West",
        activeBookings: [],
        pastBookings: []
    })
    const [userInfoLoaded, setUserInfoLoaded] = useState(false)

    useEffect(() => {
        // TODO: request user information from backend
        const fetchData = async () => {
            const response = await fetch("http://localhost:8080/api/settings/overviewprofileinfo", {
                method: "GET",
                credentials: "include"
            })
            if (response.ok) {
                response.json().then(data => {
                    const loadedData: UserInformationType = {
                        username: data.username,
                        fullName: data.fullName,
                        activeBookings: data.activeBookings.map((booking: any) => ({
                            id: booking.id,
                            time: new Date(booking.time),
                            status: booking.status,
                            description: booking.description
                        })),
                        pastBookings: data.pastBookings
                    }
                    setUserInformation(loadedData)
                    setUserInfoLoaded(true)
                })
            }else{
                // TODO: do something here if there was an error loading profile data
            }
        }
        fetchData()
    }, [])

    if (!userInfoLoaded) {
        return (null)
    }

    return (
        <WithAuthorization verificationRequired={true}>
            <div className={dashboardStyles.page}>
                <DashboardNavBar selectedPage="home" />
                <div style={{
                    marginTop: "50px",
                    display: "flex",
                    flexDirection: "row",
                    minWidth: "75%"
                }}>
                    {/*column 1*/}
                    <div className={dashboardStyles.column}>
                        <div className={dashboardStyles.box} style={{
                            backgroundColor: "rgba(255, 0, 0, 0)",
                            textAlign: "left",
                            fontSize: "50px",
                            pointerEvents: "none"
                        }}>
                            Welcome, <br /> {userInformation!.fullName}
                        </div>

                        <div className={dashboardStyles.box}>
                            <PastBookings bookingsList={userInformation.pastBookings} />
                        </div>


                    </div>

                    {/*column 1*/}
                    <div className={dashboardStyles.column}>
                        <div className={dashboardStyles.box}>
                            <ActiveBookings bookingsList={userInformation.activeBookings} />
                        </div>

                        <div className={dashboardStyles.box}>
                            <label className={dashboardStyles.heading}>
                                Help Desk
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </WithAuthorization>
    )
}

export default AccountDashboard