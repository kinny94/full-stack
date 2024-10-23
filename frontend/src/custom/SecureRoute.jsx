import { useOktaAuth } from '@okta/okta-react';
import { Navigate, Outlet } from 'react-router-dom';
import {Spinner} from "../layouts/utils/Spinner";

export const SecureRoute = () => {
    const { authState, oktaAuth } = useOktaAuth();

    // If authState is still loading, return a loading message or spinner
    if (!authState) {
        return <Spinner />;
    }

    // If not authenticated, redirect to login
    if (!authState.isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // If authenticated, render the protected routes
    return <Outlet />;
};
