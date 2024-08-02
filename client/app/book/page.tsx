'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { getCsrfToken } from '../utils/csrfToken'

function Book() {
    const router = useRouter()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        const form = event.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            city: formData.get('city'),
            timing: formData.get('timing'),
            haircutDetails: formData.get('haircutDetails'),
        };
        const csrfToken = await getCsrfToken(); 

        const response = await fetch('http://localhost:8080/api/book', {
            method: 'POST',
            credentials: 'include',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            router.push('/');
        } else {
            alert('Error booking appointment');
        }
    }

    return (
        <main>
            <div>Booking Page</div>
            <form id="book" onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" required />
                </label>
                <br />
                <label>
                    City:
                    <input type="text" name="city" required />
                </label>
                <br />
                <label>
                    Timing:
                    <input type="datetime-local" name="timing" required />
                </label>
                <br />
                <label>
                    Haircut:
                    <input type="text" name="haircutDetails" required />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        </main>
    )
}

export default Book
