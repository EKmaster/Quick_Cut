export const getCsrfToken = async () => {
    const response = await fetch('/api/csrf-token', {
        credentials: 'include',
    });
    const data = await response.json();
    return data.csrfToken;
};