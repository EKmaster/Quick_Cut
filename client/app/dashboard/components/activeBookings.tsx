import React from 'react'
import dashboardStyles from "../styles/dashboard.module.css"

function ActiveBookings({ bookingsList }: {
    bookingsList: {
        id: string,
        time: Date,
        status: string,
        description: string
    }[] | null
}) {

    return (
        <>
            <div className={dashboardStyles.heading}>
                Active Bookings
            </div>


            {
                typeof bookingsList === null ? (
                    <p>Error loading bookings</p>
                ) : (bookingsList!.length === 0) ? (
                    <div>No active bookings to show.<br/>Feeling a lil' shabby? Book one now!</div>
                ) : (
                    <ul className={dashboardStyles.inBoxList}>
                        {
                            bookingsList!.map(({ id, time, status, description }) => (
                                <li key={id}>
                                    {String(time)}<br/>
                                    {description}<br/>
                                    Status: {status}<br/>
                                    <em>ID: {id}</em>
                                </li>
                            ))
                        }
                    </ul>
                )
            }

        </>
    )
}

export default ActiveBookings