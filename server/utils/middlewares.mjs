import csrf from 'csurf';

const csrfProtection = csrf({ cookie: { httpOnly: true, secure: true, sameSite: 'Strict' } });

export default csrfProtection