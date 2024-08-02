export const getCsrfToken = async () => {
    const response = await fetch('http://localhost:8080/api/csrf-token', {
        credentials: 'include',
    });
    const data = await response.json();
    return data.csrfToken;
};