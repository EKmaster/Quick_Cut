"use client";
import React, { useEffect, useState } from 'react'

const ViewBookings = () => {
    const [bookings, setBookings] = useState([]);
    useEffect(() => {
        fetch("/api/bookings").then(
            response => response.json()
        ).then(
            data => {
                setBookings(data)
            }
        )
    })

    return (
        <main>
            <h1>Bookings List</h1>
            ---------------------
            {
                bookings.map((booking) => (
                    <div key="key">
                        Name: {booking["name"]}<br/>
                        City: {booking["city"]}<br/>
                        Timing: {booking["timing"]}<br/>
                        Haircut: {booking["haircut"]}<br/>
                        ---------------------
                    </div>
                ))
            }
        </main>
    )
}

export default ViewBookings