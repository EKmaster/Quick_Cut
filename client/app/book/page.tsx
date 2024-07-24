import React from 'react'

const book = () => {
    return (
        <main>
            <div>Booking Page</div>
            <form id="book" method="POST" action="http://localhost:8080/api/book">
                <label>
                    Name:
                    <input type="text" name="name" />
                </label>
                <br></br>
                <label>
                    City:
                    <input type="text" name="city" />
                </label>
                <br></br>
                <label>
                    Timing:
                    <input type="text" name="timing" />
                </label>
                <br></br>
                <label>
                    Haircut:
                    <input type="text" name="haircut" />
                </label>
                <br></br>
                <button type="submit"> Submit</button>
            </form>
        </main>
    )
}

export default book