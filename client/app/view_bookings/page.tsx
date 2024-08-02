"use client";
import React, { useEffect, useState } from 'react'

const view_bookings = () => {
    const [bookings, setBookings] = useState([]);
    useEffect(() => {
        fetch("http://localhost:8080/api/bookings").then(
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
                    <div>
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

export default view_bookings