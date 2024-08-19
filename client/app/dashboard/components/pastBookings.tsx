import React from 'react'
import dashboardStyles from "../styles/dashboard.module.css"

function PastBookings({ bookingsList }: {
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
                    <div>No past bookings to show</div>
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

export default PastBookings