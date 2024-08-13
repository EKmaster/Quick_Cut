export const userVerified = async () => {

    const response = await fetch('http://localhost:8080/api/auth/verified', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    })
    if (response.ok) {
        return true
    } else {
        return false
    }
}