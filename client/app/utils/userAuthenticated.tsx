export const userAuthenticated = async () => {
    
    const response = await fetch('http://localhost:8080/api/auth/status', {
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