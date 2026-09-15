import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase();
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';
const SESSION_KEY = 'angura-editor-session';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            return sessionStorage.getItem(SESSION_KEY) === 'active'
                ? { email: ADMIN_EMAIL }
                : null;
        } catch {
            return null;
        }
    });

    const login = (email, password) => {
        const valid =
            email.trim().toLowerCase() === ADMIN_EMAIL &&
            password === ADMIN_PASSWORD &&
            Boolean(ADMIN_EMAIL && ADMIN_PASSWORD);
        if (!valid) throw new Error('Credenciales incorrectas');
        sessionStorage.setItem(SESSION_KEY, 'active');
        setUser({ email: ADMIN_EMAIL });
    };

    const logout = () => {
        sessionStorage.removeItem(SESSION_KEY);
        setUser(null);
    };

    const value = useMemo(
        () => ({
            user,
            isAuthed: Boolean(user),
            isAdmin: Boolean(user),
            login,
            logout,
        }),
        [user],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
