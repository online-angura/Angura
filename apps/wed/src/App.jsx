import React from 'react';
import { Navigate, Route, Routes, BrowserRouter as Router, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
    const { pathname, search, hash } = useLocation();
    const queryRedirect = new URLSearchParams(search).get('redirect');
    const hashRoute = hash.startsWith('#/') ? hash.slice(1) : null;
    const redirect = queryRedirect || hashRoute;
    const target = redirect && redirect.startsWith('/') ? redirect : '/store';

    if (hashRoute && hashRoute !== pathname) {
        return <Navigate to={hashRoute} replace />;
    }

    if (pathname === '/' && redirect) {
        return <Navigate to={target} replace />;
    }

    if (pathname === '/' && !redirect) {
        return <Navigate to="/store" replace />;
    }

    return (
        <Routes>
            <Route path="/store" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/editor"
                element={
                    <ProtectedRoute>
                        <EditorPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

function App() {
    const basename = import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '');

    return (
        <Router basename={basename}>
            <ScrollToTop />
            <AppRoutes />
        </Router>
    );
}

export default App;
